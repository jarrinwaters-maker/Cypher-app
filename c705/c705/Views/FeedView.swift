//
//  FeedView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct FeedView: View {
    @StateObject private var viewModel = FeedViewModel()
    @State private var selectedTab = "Trending"
    @State private var searchText = ""
    @State private var showProfile = false
    @EnvironmentObject var authService: AuthService
    
        let tabs = ["Trending", "Articles", "Events", "City"]
    
    func getSearchPlaceholder() -> String {
        return "Search"
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Top Bar with Search and Profile
            HStack(spacing: 12) {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField(getSearchPlaceholder(), text: $searchText)
                        .textFieldStyle(.plain)
                        .onSubmit {
                            // Trigger search when user presses return
                        }
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color(.systemGray6))
                .cornerRadius(10)
                
                // Profile Button
                Button(action: {
                    showProfile = true
                }) {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(.primary)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(.systemBackground))
            
            // Tab Navigation
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 24) {
                    ForEach(tabs, id: \.self) { tab in
                        Button(action: {
                            selectedTab = tab
                        }) {
                            VStack(spacing: 4) {
                                Text(tab)
                                    .font(.system(size: 16, weight: selectedTab == tab ? .bold : .regular))
                                    .foregroundColor(selectedTab == tab ? .primary : .secondary)
                                
                                if selectedTab == tab {
                                    Rectangle()
                                        .fill(Color.primary)
                                        .frame(height: 2)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
            .padding(.vertical, 8)
            .background(Color(.systemBackground))
            
            // Tab Content
            Group {
                switch selectedTab {
                case "Trending":
                    TrendingView(searchText: $searchText)
                        .environmentObject(authService)
                case "Articles":
                    ArticlesView(searchText: $searchText)
                        .environmentObject(authService)
                case "Events":
                    EventsView(searchText: $searchText)
                        .environmentObject(authService)
                case "City":
                    CityView(searchText: $searchText)
                        .environmentObject(authService)
                default:
                    TrendingView(searchText: $searchText)
                        .environmentObject(authService)
                }
            }
            .overlay(alignment: .bottomTrailing) {
                // Floating Action Button (FAB)
                Button(action: {
                    // TODO: Implement recording functionality
                }) {
                    Image(systemName: "mic.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white)
                        .frame(width: 56, height: 56)
                        .background(Color.blue)
                        .clipShape(Circle())
                        .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 4)
                }
                .padding(.trailing, 20)
                .padding(.bottom, 20)
            }
        }
        .task {
            if viewModel.feedItems.isEmpty {
                await viewModel.loadFeed()
                AnalyticsService.shared.trackFeedView()
            }
        }
        .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
            Button("OK") {
                viewModel.errorMessage = nil
            }
            Button("Retry") {
                Task {
                    await viewModel.refresh()
                }
            }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
        .sheet(isPresented: $showProfile) {
            ProfileView()
                .environmentObject(authService)
        }
    }
}

// ProfileView moved to separate file: ProfileView.swift

#Preview {
    FeedView()
        .environmentObject(AuthService())
}

