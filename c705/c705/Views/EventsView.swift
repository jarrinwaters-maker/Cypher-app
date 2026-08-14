//
//  EventsView.swift
//  c705
//
//  Created for Events tab (placeholder)
//

import SwiftUI
import Combine

struct EventsView: View {
    @EnvironmentObject var authService: AuthService
    @Binding var searchText: String
    @StateObject private var viewModel = EventsViewModel()
    
    init(searchText: Binding<String> = .constant("")) {
        _searchText = searchText
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if viewModel.isLoading {
                    ProgressView("Searching events...")
                        .padding()
                } else if !searchText.isEmpty && viewModel.events.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "calendar.badge.exclamationmark")
                            .font(.system(size: 48))
                            .foregroundColor(.gray)
                        Text("No events found")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 60)
                } else {
                    Image(systemName: "calendar")
                        .font(.system(size: 48))
                        .foregroundColor(.gray)
                    
                    Text("Events Coming Soon")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.primary)
                    
                    Text("Stay tuned for upcoming music events, concerts, and cypher battles in your area.")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }
            }
            .padding(.top, 100)
        }
        .onChange(of: searchText) { oldValue, newValue in
            Task {
                await viewModel.searchEvents(query: newValue)
            }
        }
    }
}

@MainActor
class EventsViewModel: ObservableObject {
    @Published var events: [String] = [] // Placeholder - replace with Event model
    @Published var isLoading = false
    
    func searchEvents(query: String) async {
        if query.isEmpty {
            events = []
            return
        }
        
        isLoading = true
        // TODO: Implement actual event search API call
        // For now, just clear results
        events = []
        isLoading = false
    }
}

#Preview {
    EventsView()
        .environmentObject(AuthService())
}

