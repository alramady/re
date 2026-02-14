/**
 * Central image registry for all CDN-hosted assets
 * Transparent PNG logos and 3D Arabic character illustrations
 */

export const IMAGES = {
  // Main Rased logo (dark navy)
  logoMain: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/MqXVpxSpMzayTNsa.png',
  // Logo dark variant
  logoDark: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/JQTNPhgncFRbmJio.png',
  // Logo white variant (for splash)
  logoWhite: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/YyXzAHrvYpprtpzG.png',
  // NDMO Office logo
  logoOffice: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/bltsnPDPVynJFYpl.png',

  // ===== 3D ARABIC CHARACTERS =====
  charLaptop: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/NVPWsXEmmRlKpXNl.png',
  charStanding: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/YGGLRwNmDCIHmIbJ.png',
  charTablet: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/IvmwtOmnPrGvRhHU.png',
  charPro3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/NzBULiQJJpYwDYHd.png',
  charElegant: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/vvvAhmqXgdNmWsKY.png',
  charProfile: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/hziJIcJYyBQvyCGq.png',
  charPortal: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/WmfgyfGiAWHretsV.png',
  charMarketplace: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/ncHDcHrUKWwLkXGH.png',
  charData: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/WDIQMOZyWgvyQUOR.png',
} as const;

export type ImageKey = keyof typeof IMAGES;
