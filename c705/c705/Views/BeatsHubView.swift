//
//  BeatsHubView.swift
//  c705
//
//  Created for Beats feature
//

import SwiftUI

struct BeatsHubView: View {
    @StateObject private var viewModel = BeatsHubViewModel()
    @EnvironmentObject var authService: AuthService
    @State private var showFilters = false
    @State private var showUploadSheet = false
    
    var isProducer: Bool {
        authService.currentUser?.role == "PRODUCER"
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 0) {
                    // Search Bar
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                            .padding(.leading, 12)
                        
                        TextField("Search", text: $viewModel.searchText)
                            .textFieldStyle(PlainTextFieldStyle())
                            .padding(.vertical, 10)
                        
                        if !viewModel.searchText.isEmpty {
                            Button(action: {
                                viewModel.searchText = ""
                            }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.gray)
                                    .padding(.trailing, 12)
                            }
                        }
                    }
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(10)
                    .padding(.horizontal)
                    .padding(.top, 8)
                    .padding(.bottom, 12)
                    
                    // Header with filters and upload button
                    HStack {
                        Text("Beats Marketplace")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.black)
                        
                        Spacer()
                        
                        // Upload button for all authenticated users (Producer/Admin can sell; others upload for cyphers)
                        if authService.currentUser != nil {
                            Button(action: {
                                showUploadSheet = true
                            }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.blue)
                            }
                            .padding(.trailing, 8)
                        }
                        
                        Button(action: {
                            showFilters.toggle()
                        }) {
                            Image(systemName: "slider.horizontal.3")
                                .font(.system(size: 18))
                                .foregroundColor(.blue)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 12)
                
                // Active filters display
                if viewModel.selectedGenre != nil || viewModel.selectedMood != nil {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            if let genre = viewModel.selectedGenre {
                                FilterChip(title: genre, action: {
                                    viewModel.applyFilters(genre: nil, bpm: nil, mood: viewModel.selectedMood)
                                })
                            }
                            if let mood = viewModel.selectedMood {
                                FilterChip(title: mood, action: {
                                    viewModel.applyFilters(genre: viewModel.selectedGenre, bpm: nil, mood: nil)
                                })
                            }
                            Button(action: {
                                viewModel.clearFilters()
                            }) {
                                Text("Clear All")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.red)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color.red.opacity(0.1))
                                    .cornerRadius(16)
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.bottom, 12)
                }
                
                // Beats list
                if viewModel.isLoading && viewModel.beats.isEmpty {
                    ProgressView("Loading beats...")
                        .padding()
                } else if viewModel.filteredBeats.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "music.note.list")
                            .font(.system(size: 48))
                            .foregroundColor(.gray)
                        Text(viewModel.searchText.isEmpty ? "No beats found" : "No results for \"\(viewModel.searchText)\"")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.gray)
                        if !viewModel.searchText.isEmpty {
                            Button(action: {
                                viewModel.searchText = ""
                            }) {
                                Text("Clear Search")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.blue)
                            }
                        } else if viewModel.selectedGenre != nil || viewModel.selectedMood != nil {
                            Button(action: {
                                viewModel.clearFilters()
                            }) {
                                Text("Clear Filters")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                    .padding(.top, 60)
                } else {
                    LazyVStack(spacing: 16) {
                        ForEach(viewModel.filteredBeats) { beat in
                            NavigationLink(destination: BeatDetailView(beat: beat)) {
                                BeatCardView(beat: beat)
                            }
                            .buttonStyle(PlainButtonStyle())
                            .transition(AppAnimations.listTransition)
                        }
                        
                        if viewModel.isLoading {
                            ProgressView()
                                .padding()
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                    .animation(AppAnimations.fastSpring, value: viewModel.filteredBeats.count)
                }
                }
            }
            .refreshable {
                await viewModel.refreshBeats()
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    EmptyView()
                }
            }
            .sheet(isPresented: $showFilters) {
                BeatsFiltersView(viewModel: viewModel)
            }
            .sheet(isPresented: $showUploadSheet) {
                UploadBeatView(viewModel: viewModel)
            }
            .task {
                await viewModel.loadBeats()
            }
        }
    }
}

struct BeatCardView: View {
    let beat: Beat
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Beat info
            VStack(alignment: .leading, spacing: 4) {
                Text(beat.title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.black)
                    .lineLimit(1)
                
                if let producer = beat.producer {
                    Text(producer.username ?? producer.email)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
            }
            
            // Genre, BPM, Mood
            HStack(spacing: 12) {
                Label(beat.genre, systemImage: "music.note")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                
                Label("\(beat.bpm) BPM", systemImage: "metronome")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                
                if let mood = beat.mood {
                    Label(mood, systemImage: "face.smiling")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            
            // Price
            HStack {
                Spacer()
                Text(formatPrice(beat.price))
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
    
    private func formatPrice(_ cents: Int) -> String {
        let dollars = Double(cents) / 100.0
        return String(format: "$%.2f", dollars)
    }
}

struct FilterChip: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.blue)
            
            Button(action: action) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 12))
                    .foregroundColor(.blue)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(Color.blue.opacity(0.1))
        .cornerRadius(16)
    }
}

struct BeatsFiltersView: View {
    @ObservedObject var viewModel: BeatsHubViewModel
    @Environment(\.dismiss) var dismiss
    @State private var selectedGenre: String?
    @State private var selectedMood: String?
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Genre")) {
                    Picker("Genre", selection: $selectedGenre) {
                        Text("All").tag(nil as String?)
                        ForEach(viewModel.genres, id: \.self) { genre in
                            Text(genre).tag(genre as String?)
                        }
                    }
                }
                
                Section(header: Text("Mood")) {
                    Picker("Mood", selection: $selectedMood) {
                        Text("All").tag(nil as String?)
                        ForEach(viewModel.moods, id: \.self) { mood in
                            Text(mood).tag(mood as String?)
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Apply") {
                        viewModel.applyFilters(genre: selectedGenre, bpm: nil, mood: selectedMood)
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            selectedGenre = viewModel.selectedGenre
            selectedMood = viewModel.selectedMood
        }
    }
}

