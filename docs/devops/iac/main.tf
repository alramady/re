_# Terraform Infrastructure as Code for Munsiq Platform on AWS

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "munsiq-terraform-state-bucket"
    key            = "global/s3/terraform.tfstate"
    region         = "me-south-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = "me-south-1"
}

# ========= VPC =========
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "munsiq-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["me-south-1a", "me-south-1b", "me-south-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform   = "true"
    Environment = "prod"
  }
}

# ========= EKS Cluster =========
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"

  cluster_name    = "munsiq-prod-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 5
      desired_size = 3

      instance_types = ["t3.large"]
    }
  }

  tags = {
    Environment = "prod"
  }
}

# ========= RDS (PostgreSQL) =========
module "rds-aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "8.0.1"

  name              = "munsiq-db-cluster"
  engine            = "aurora-postgresql"
  engine_version    = "16.1"
  instance_class    = "db.r6g.large"
  instances_count   = 2

  vpc_id            = module.vpc.vpc_id
  db_subnet_group_name = module.vpc.database_subnet_group_name
  create_db_subnet_group = false

  master_username   = "masteruser" # Should be sourced from a secrets manager
  master_password   = "masterpassword" # Should be sourced from a secrets manager

  tags = {
    Environment = "prod"
  }
}

# ========= ElastiCache (Redis) =========
module "elasticache" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "3.1.0"

  cluster_id      = "munsiq-redis-cluster"
  engine          = "redis"
  node_type       = "cache.t3.medium"
  num_cache_nodes = 2
  parameter_group_name = "default.redis7"

  subnet_ids = module.vpc.private_subnets
  vpc_id     = module.vpc.vpc_id

  tags = {
    Environment = "prod"
  }
}

# ========= S3 Bucket for Documents =========
resource "aws_s3_bucket" "documents" {
  bucket = "munsiq-documents-prod"

  tags = {
    Name        = "Munsiq Documents"
    Environment = "prod"
  }
}

resource "aws_s3_bucket_public_access_block" "documents_public_access" {
  bucket = aws_s3_bucket.documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "documents_versioning" {
  bucket = aws_s3_bucket.documents.id
  versioning_configuration {
    status = "Enabled"
  }
}
