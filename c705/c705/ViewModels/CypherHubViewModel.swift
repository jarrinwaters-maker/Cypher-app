//
//  CypherHubViewModel.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import Combine

@MainActor
class CypherHubViewModel: ObservableObject {
    @Published var cyphers: [Cypher] = []
    @Published var topCyphers: [TopCypher] = []
    @Published var trendingCyphers: [TopCypher] = []
    @Published var invites: [CypherInvite] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = APIService.shared
    private var isLoadingInProgress = false
    
    func loadCyphers() async {
        // Prevent multiple simultaneous loads
        guard !isLoadingInProgress else {
            return
        }
        
        isLoadingInProgress = true
        isLoading = true
        errorMessage = nil
        
        do {
            // Load all active cyphers
            let response = try await apiService.getActiveCyphers(page: 1, limit: 50)
            cyphers = response.cyphers
            
            // Load top cyphers (this week) - handle errors gracefully; no trending fetch (tab removed)
            do {
                topCyphers = try await apiService.getTopCyphers(range: "week", limit: 10)
            } catch {
                topCyphers = []
            }
            
            trendingCyphers = []
            
            // Load user's invites (handle errors gracefully - might fail if not authenticated)
            invites = try await apiService.getUserCypherInvites()
        } catch {
            errorMessage = "Failed to load cyphers: \(error.localizedDescription)"
            print("Error loading cyphers: \(error)")
        }
        
        isLoading = false
        isLoadingInProgress = false
    }
}

