//
//  c705App.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

@main
struct c705App: App {
    @StateObject private var authService = AuthService()
    
    init() {
        // Track app open
        AnalyticsService.shared.trackAppOpen()
        AnalyticsService.shared.trackSessionStart()
        
        // Configure ngrok URL for physical device testing
        // TODO: Replace with your actual ngrok URL when testing on physical device
        // Get your ngrok URL from the ngrok terminal output (the https:// URL)
        #if !targetEnvironment(simulator)
        // Uncomment and set your ngrok URL here:
        // UserDefaults.standard.set("https://your-ngrok-url.ngrok.app", forKey: "customBackendURL")
        
        // Example (replace with your actual ngrok URL):
        // UserDefaults.standard.set("https://abc123-def456.ngrok.app", forKey: "customBackendURL")
        #endif
    }
    
    var body: some Scene {
        WindowGroup {
            // Always show LoginView first - users must authenticate each time
            LoginView()
                .environmentObject(authService)
                .onChange(of: authService.isAuthenticated) { oldValue, newValue in
                    // Navigation to MainTabView will be handled within LoginView
                }
        }
    }
}
