//
//  CypherVotingView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct CypherVotingView: View {
    let entry: CypherEntry
    let onVote: (Int, Int, Int) -> Void
    @Environment(\.dismiss) var dismiss
    @State private var bars: Double = 3.0
    @State private var flow: Double = 3.0
    @State private var creativity: Double = 3.0
    @State private var hasPlayedFullEntry = false
    @State private var isPlaying = false
    @State private var playbackProgress: Double = 0
    @State private var isSubmitting = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Entry Info
                    VStack(spacing: 8) {
                        Text(entry.user?.username ?? entry.user?.email ?? "Unknown")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        if let title = entry.title {
                            Text(title)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()
                    
                    // Audio Player
                    VStack(spacing: 12) {
                        HStack {
                            Button(action: {
                                // TODO: Implement audio playback
                                isPlaying.toggle()
                                if isPlaying {
                                    // Start playback tracking
                                    startPlaybackTracking()
                                }
                            }) {
                                Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                                    .font(.system(size: 50))
                                    .foregroundColor(.blue)
                            }
                            
                            // Progress bar
                            GeometryReader { geometry in
                                ZStack(alignment: .leading) {
                                    Rectangle()
                                        .fill(Color.gray.opacity(0.3))
                                        .frame(height: 4)
                                    
                                    Rectangle()
                                        .fill(Color.blue)
                                        .frame(width: geometry.size.width * playbackProgress, height: 4)
                                }
                            }
                            .frame(height: 4)
                        }
                        .padding(.horizontal)
                        
                        if !hasPlayedFullEntry {
                            Text("Please listen to the full entry before voting")
                                .font(.caption)
                                .foregroundColor(.orange)
                        } else {
                            Text("✓ Entry played")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.horizontal)
                    
                    // Voting Sliders
                    VStack(spacing: 20) {
                        Text("Rate this entry")
                            .font(.headline)
                            .padding(.top)
                        
                        // Bars Rating
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Bars")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Text("\(Int(bars))")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.blue)
                            }
                            
                            Slider(value: $bars, in: 1...5, step: 1)
                                .accentColor(.blue)
                            
                            HStack {
                                Text("1")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                Spacer()
                                Text("5")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                        
                        // Flow Rating
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Flow")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Text("\(Int(flow))")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.blue)
                            }
                            
                            Slider(value: $flow, in: 1...5, step: 1)
                                .accentColor(.blue)
                            
                            HStack {
                                Text("1")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                Spacer()
                                Text("5")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                        
                        // Creativity Rating
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Creativity")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Text("\(Int(creativity))")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.blue)
                            }
                            
                            Slider(value: $creativity, in: 1...5, step: 1)
                                .accentColor(.blue)
                            
                            HStack {
                                Text("1")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                Spacer()
                                Text("5")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                    .padding(.horizontal)
                    
                    // Submit Vote Button
                    Button(action: {
                        isSubmitting = true
                        onVote(Int(bars), Int(flow), Int(creativity))
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            isSubmitting = false
                            dismiss()
                        }
                    }) {
                        HStack {
                            if isSubmitting {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Image(systemName: "checkmark.circle.fill")
                            }
                            Text(isSubmitting ? "Submitting..." : "Submit Vote")
                                .font(.system(size: 16, weight: .medium))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(hasPlayedFullEntry ? Color.blue : Color.gray)
                        .cornerRadius(10)
                    }
                    .disabled(!hasPlayedFullEntry || isSubmitting)
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                }
            }
            .navigationTitle("Vote")
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
    
    private func startPlaybackTracking() {
        // TODO: Implement actual audio playback tracking
        // For now, simulate playback completion after 3 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            hasPlayedFullEntry = true
            isPlaying = false
            playbackProgress = 1.0
        }
        
        // Simulate progress
        Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { timer in
            if playbackProgress < 1.0 {
                playbackProgress += 0.033 // Complete in ~3 seconds
            } else {
                timer.invalidate()
            }
        }
    }
}

