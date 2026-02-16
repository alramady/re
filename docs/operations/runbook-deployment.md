# Runbook: Deployment

| Field | Value |
|---|---|
| **Runbook ID** | RB-DEPLOY-001 |
| **Owner** | DevOps Lead |
| **Last Updated** | 2026-02-16 |

## 1. Objective

To provide a step-by-step guide for deploying a new version of the Munsiq application to the Staging and Production environments.

## 2. Prerequisites

- A successful CI build on the target branch (`develop` for Staging, `main` for Production).
- Docker images pushed to the container registry.
- `kubectl` access to the target EKS cluster.
- Approval granted for production deployment.

## 3. Deployment Steps (Automated via GitHub Actions CD)

This process is fully automated by the `cd.yml` workflow. This runbook documents the steps for manual execution in an emergency.

### Step 1: Set Up Environment

1.  **Checkout Code**: `git checkout <branch_name> && git pull`
2.  **Configure AWS CLI**: Ensure your local AWS CLI is configured with credentials that have access to the target EKS cluster.
3.  **Update Kubeconfig**: `aws eks update-kubeconfig --name <cluster_name> --region me-south-1`

### Step 2: Update Kubernetes Manifests

1.  **Identify Image Tag**: Get the Git SHA of the commit to be deployed (e.g., `a1b2c3d`). This is the Docker image tag.
2.  **Update Deployment Files**: In the `deployment-api.yaml` and `deployment-web.yaml` files, update the `image` field to point to the new Docker image tag.
    ```yaml
    # Example for API deployment
    image: your-registry/munsiq-api:a1b2c3d
    ```
3.  **Apply Manifests**: Use `kubectl` to apply the updated configurations.
    ```bash
    kubectl apply -f ./docs/devops/k8s/ -n <namespace>
    ```

### Step 3: Verify Deployment

1.  **Check Rollout Status**: Monitor the status of the rolling update.
    ```bash
    kubectl rollout status deployment/munsiq-api-deployment -n <namespace>
    kubectl rollout status deployment/munsiq-web-deployment -n <namespace>
    ```
    The command should exit with a `successfully rolled out` message.
2.  **Check Pods**: Verify that new pods are running and old pods have been terminated.
    ```bash
    kubectl get pods -n <namespace> -l app=munsiq-api
    ```
3.  **Check Logs**: Check the logs of the new pods for any startup errors.
    ```bash
    kubectl logs -f <new_pod_name> -n <namespace>
    ```

### Step 4: Post-Deployment Validation

1.  **Smoke Test**: Manually perform a quick smoke test on the application by accessing the main URL and performing a critical action (e.g., logging in).
2.  **Monitor Dashboards**: Observe monitoring dashboards (Datadog, CloudWatch) for any spikes in errors or latency.

## 4. Rollback Procedure

In case of a critical failure, roll back to the previous stable version.

1.  **Initiate Rollback**: Use the `rollout undo` command.
    ```bash
    kubectl rollout undo deployment/munsiq-api-deployment -n <namespace>
    kubectl rollout undo deployment/munsiq-web-deployment -n <namespace>
    ```
2.  **Verify Rollback**: Use `rollout status` and `get pods` to confirm that the previous version has been restored.
3.  **Create Incident Report**: Create a post-mortem incident report to document the failure and the rollback.
