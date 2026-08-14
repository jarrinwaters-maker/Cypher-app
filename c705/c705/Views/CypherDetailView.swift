//
//  CypherDetailView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct CypherDetailView: View {
    let cypherId: String
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = CypherDetailViewModel()
    @State private var selectedTab = "Details"
    @State private var showRecordSheet = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Tabs
                HStack(spacing: 0) {
                    TabButton(title: "Details", isSelected: selectedTab == "Details") {
                        selectedTab = "Details"
                    }
                    TabButton(title: "Entries", isSelected: selectedTab == "Entries") {
                        selectedTab = "Entries"
                    }
                    TabButton(title: "Leaderboard", isSelected: selectedTab == "Leaderboard") {
                        selectedTab = "Leaderboard"
                    }
                }
                .padding(.horizontal)
                .padding(.top, 8)
                
                // Content
                if selectedTab == "Details" {
                    cypherDetailsView
                } else if selectedTab == "Entries" {
                    cypherEntriesView
                } else {
                    leaderboardView
                }
            }
            .navigationTitle(viewModel.cypher?.title ?? "Cypher")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .sheet(isPresented: $showRecordSheet) {
                RecordCypherView(cypherId: cypherId, cypher: viewModel.cypher)
            }
            .task {
                await viewModel.loadCypher(id: cypherId)
            }
        }
    }
    
    private var cypherDetailsView: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                if let cypher = viewModel.cypher {
                    // Description
                    if let description = cypher.description {
                        Text(description)
                            .font(.body)
                            .foregroundColor(.black)
                            .padding()
                    }
                    
                    // Beat Preview (if beat-locked)
                    if cypher.cypherType == .beatLocked, cypher.beatUrl != nil {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Beat")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            // TODO: Add audio player for beat preview
                            Text("Beat preview coming soon")
                                .font(.caption)
                                .foregroundColor(.gray)
                                .padding(.horizontal)
                        }
                    }
                    
                    // App Store-Safe Rules & Explanation
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Rules")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            RuleRow(text: "One submission per user")
                            RuleRow(text: "Maximum 60 seconds")
                            RuleRow(text: "One take only")
                            if cypher.cypherType == .competitive {
                                RuleRow(text: "Voting determines ranking")
                            }
                        }
                        .padding(.horizontal)
                        
                        // App Store Compliance Text
                        VStack(alignment: .leading, spacing: 8) {
                            Text("How It Works")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .padding(.horizontal)
                            
                            Text("Cyphers are skill-based challenges. Rankings are determined by community voting on Bars, Flow, and Creativity (1-5 each). No purchases affect outcomes. Winners receive profile highlights and badges, not cash prizes.")
                                .font(.caption)
                                .foregroundColor(.gray)
                                .padding(.horizontal)
                                .padding(.bottom, 8)
                        }
                        .padding(.top, 8)
                        .background(Color.gray.opacity(0.05))
                        .cornerRadius(8)
                        .padding(.horizontal)
                    }
                    
                    // Submit Button
                    if viewModel.userEntry == nil {
                        Button(action: {
                            showRecordSheet = true
                        }) {
                            HStack {
                                Image(systemName: "mic.fill")
                                Text("Record Your Entry")
                                    .font(.system(size: 16, weight: .medium))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                        }
                        .padding()
                    } else {
                        VStack(spacing: 8) {
                            Text("You've already submitted an entry")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                            
                            if let entry = viewModel.userEntry {
                                Text("Score: \(String(format: "%.1f", entry.averageScore ?? 0))")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.blue)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                    }
                } else if viewModel.isLoading {
                    ProgressView("Loading...")
                        .frame(maxWidth: .infinity)
                        .padding()
                }
            }
            .padding(.vertical)
        }
    }
    
    private var cypherEntriesView: some View {
        ScrollView {
            VStack(spacing: 12) {
                if viewModel.isLoadingEntries {
                    ProgressView("Loading entries...")
                        .padding()
                } else if viewModel.entries.isEmpty {
                    Text("No entries yet")
                        .foregroundColor(.gray)
                        .padding()
                } else {
                    ForEach(viewModel.entries) { entry in
                        CypherEntryRowView(entry: entry, onVote: { bars, flow, creativity in
                            Task {
                                await viewModel.voteEntry(entryId: entry.id, bars: bars, flow: flow, creativity: creativity)
                            }
                        })
                    }
                }
            }
            .padding()
        }
        .task {
            await viewModel.loadEntries(cypherId: cypherId)
        }
    }
    
    private var leaderboardView: some View {
        ScrollView {
            VStack(spacing: 12) {
                if viewModel.isLoadingLeaderboard {
                    ProgressView("Loading leaderboard...")
                        .padding()
                } else if viewModel.leaderboard.isEmpty {
                    Text("No rankings yet")
                        .foregroundColor(.gray)
                        .padding()
                } else {
                    ForEach(viewModel.leaderboard, id: \.rank) { leaderboardEntry in
                        LeaderboardRowView(entry: leaderboardEntry)
                    }
                }
            }
            .padding()
        }
        .task {
            await viewModel.loadLeaderboard(cypherId: cypherId)
        }
    }
}

struct RuleRow: View {
    let text: String
    
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
                .font(.system(size: 12))
            Text(text)
                .font(.system(size: 14))
                .foregroundColor(.black)
        }
    }
}


