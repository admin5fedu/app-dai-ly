/**
 * Google Sheets Configuration
 * Lấy thông tin từ environment variables
 */

export const googleSheetsConfig = {
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '',
  serviceAccount: {
    type: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_TYPE || 'service_account',
    project_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID || '',
    private_key_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID || '',
    private_key: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    client_email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL || '',
    client_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID || '',
    auth_uri: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL || '',
    universe_domain: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN || 'googleapis.com',
  },
}

