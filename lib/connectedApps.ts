export interface ConnectedApp {
  id: string
  name: string
  icon: string
  connected: boolean
  setupInstructions: {
    title: string
    steps: string[]
    note?: string
  }
}

export class ConnectedAppsStorage {
  private static readonly STORAGE_KEY = 'apexmarketer-connected-apps'

  static getConnectedApps(): ConnectedApp[] {
    if (typeof window === 'undefined') return this.getDefaultApps()
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const storedApps = JSON.parse(stored)
        // Merge with default apps to ensure we have all apps with latest setup instructions
        const defaultApps = this.getDefaultApps()
        return defaultApps.map(defaultApp => {
          const storedApp = storedApps.find((app: ConnectedApp) => app.id === defaultApp.id)
          return storedApp ? { ...defaultApp, connected: storedApp.connected } : defaultApp
        })
      }
      return this.getDefaultApps()
    } catch (error) {
      console.error('Error loading connected apps:', error)
      return this.getDefaultApps()
    }
  }

  static updateAppConnection(appId: string, connected: boolean): void {
    if (typeof window === 'undefined') return

    try {
      const apps = this.getConnectedApps()
      const updatedApps = apps.map(app => 
        app.id === appId ? { ...app, connected } : app
      )
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedApps))
    } catch (error) {
      console.error('Error updating app connection:', error)
    }
  }

  private static getDefaultApps(): ConnectedApp[] {
    return [
      {
        id: 'slack',
        name: 'Slack',
        icon: '💬',
        connected: false,
        setupInstructions: {
          title: 'Connect Slack to ApexMarketer-AI',
          steps: [
            'Go to your Slack workspace settings',
            'Navigate to "Apps" in the left sidebar',
            'Click "Build" and then "Create an App"',
            'Choose "From scratch" and name it "ApexMarketer-AI"',
            'Go to "OAuth & Permissions" in the left sidebar',
            'Add these Bot Token Scopes: channels:read, chat:write, users:read',
            'Click "Install to Workspace" and authorize the app',
            'Copy the "Bot User OAuth Token" that starts with "xoxb-"',
            'Paste the token in ApexMarketer-AI settings'
          ],
          note: 'This will allow ApexMarketer-AI to send marketing insights and reports directly to your Slack channels.'
        }
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: '📝',
        connected: false,
        setupInstructions: {
          title: 'Connect Notion to ApexMarketer-AI',
          steps: [
            'Go to https://www.notion.so/my-integrations',
            'Click "Create new integration"',
            'Name it "ApexMarketer-AI" and select your workspace',
            'Click "Submit" to create the integration',
            'Copy the "Internal Integration Token"',
            'Go to your Notion workspace and create a new page for marketing data',
            'Click "Share" on the page and invite your integration',
            'Search for "ApexMarketer-AI" and click "Invite"',
            'Copy the page URL and paste both the token and URL in ApexMarketer-AI settings'
          ],
          note: 'This enables ApexMarketer-AI to create marketing reports, campaign plans, and content calendars directly in your Notion workspace.'
        }
      },
      {
        id: 'googledrive',
        name: 'Google Drive',
        icon: '📁',
        connected: false,
        setupInstructions: {
          title: 'Connect Google Drive to ApexMarketer-AI',
          steps: [
            'Go to https://console.cloud.google.com/',
            'Create a new project or select an existing one',
            'Enable the Google Drive API for your project',
            'Go to "Credentials" and click "Create Credentials"',
            'Choose "OAuth 2.0 Client IDs"',
            'Select "Web application" as the application type',
            'Add your ApexMarketer-AI domain to authorized origins',
            'Download the JSON credentials file',
            'Upload the credentials file in ApexMarketer-AI settings',
            'Authorize access to your Google Drive'
          ],
          note: 'This allows ApexMarketer-AI to save marketing assets, reports, and campaign materials directly to your Google Drive folders.'
        }
      }
    ]
  }
}