//
//  CypherEntryRowView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct CypherEntryRowView: View {
    let entry: CypherEntry
    let onVote: (Int, Int, Int) -> Void
    @State private var isPlaying = false
    @State private var hasVoted = false
    @State private var showReportSheet = false
    @State private var showVotingSheet = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // User Info
            HStack {
                Circle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(String((entry.user?.username ?? entry.user?.email ?? "U").prefix(1)).uppercased())
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.blue)
                    )
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.user?.username ?? entry.user?.email ?? "Unknown")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.black)
                    
                    if let title = entry.title {
                        Text(title)
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                }
                
                Spacer()
                
                // Score
                if let score = entry.averageScore, score > 0 {
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(String(format: "%.1f", score))
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.blue)
                        Text("\(entry.voteCount) votes")
                            .font(.system(size: 10))
                            .foregroundColor(.gray)
                    }
                }
            }
            
            // Audio Player
            HStack {
                Button(action: {
                    // TODO: Play audio
                    isPlaying.toggle()
                }) {
                    Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.blue)
                }
                
                // Waveform placeholder
                HStack(spacing: 2) {
                    ForEach(0..<20, id: \.self) { _ in
                        Rectangle()
                            .fill(Color.blue.opacity(0.3))
                            .frame(width: 3, height: CGFloat.random(in: 10...30))
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 40)
                
                // Report Button
                Button(action: {
                    showReportSheet = true
                }) {
                    Image(systemName: "flag")
                        .font(.system(size: 16))
                        .foregroundColor(.gray)
                }
            }
            
            // Voting Section
            if !hasVoted {
                Button(action: {
                    showVotingSheet = true
                }) {
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundColor(.blue)
                        Text("Vote on this entry")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                }
                .padding(.top, 8)
            } else {
                Text("You've voted on this entry")
                    .font(.caption)
                    .foregroundColor(.green)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        .sheet(isPresented: $showReportSheet) {
            ReportEntryView(entryId: entry.id)
        }
        .sheet(isPresented: $showVotingSheet) {
            CypherVotingView(entry: entry) { bars, flow, creativity in
                onVote(bars, flow, creativity)
                hasVoted = true
            }
        }
    }
}

struct LeaderboardRowView: View {
    let entry: LeaderboardEntry
    
    var body: some View {
        HStack(spacing: 12) {
            // Rank
            Text("#\(entry.rank)")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(entry.rank <= 3 ? .orange : .gray)
                .frame(width: 40)
            
            // User
            Circle()
                .fill(Color.blue.opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Text(String((entry.entry.user?.username ?? entry.entry.user?.email ?? "U").prefix(1)).uppercased())
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.blue)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.entry.user?.username ?? entry.entry.user?.email ?? "Unknown")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.black)
                
                if let title = entry.entry.title {
                    Text(title)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            
            Spacer()
            
            // Score
            VStack(alignment: .trailing, spacing: 2) {
                Text(String(format: "%.1f", entry.entry.averageScore ?? 0))
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.blue)
                Text("\(entry.entry.voteCount) votes")
                    .font(.system(size: 10))
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(entry.rank <= 3 ? Color.orange.opacity(0.1) : Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

struct ReportEntryView: View {
    let entryId: String
    @Environment(\.dismiss) var dismiss
    @State private var reason = ""
    @State private var isSubmitting = false
    
    private let apiService = APIService.shared
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Report Entry")
                    .font(.headline)
                    .padding(.top)
                
                Text("Please provide a reason for reporting this entry")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                TextEditor(text: $reason)
                    .frame(height: 150)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )
                    .padding(.horizontal)
                
                Button(action: {
                    Task {
                        await submitReport()
                    }
                }) {
                    Text(isSubmitting ? "Submitting..." : "Submit Report")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(reason.isEmpty ? Color.gray : Color.red)
                        .cornerRadius(10)
                }
                .disabled(reason.isEmpty || isSubmitting)
                .padding(.horizontal)
                
                Spacer()
            }
            .navigationTitle("Report")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func submitReport() async {
        isSubmitting = true
        
        do {
            try await apiService.reportCypherEntry(entryId: entryId, reason: reason)
            dismiss()
        } catch {
            print("Error reporting entry: \(error)")
            // TODO: Show error alert
        }
        
        isSubmitting = false
    }
}

