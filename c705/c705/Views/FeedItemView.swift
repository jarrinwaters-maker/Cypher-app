//
//  FeedItemView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct FeedItemView: View {
    let item: FeedItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if item.type == .track {
                TrackFeedItemView(item: item)
            } else {
                ArticleFeedItemView(item: item)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

struct TrackFeedItemView: View {
    let item: FeedItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header with title and artist
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(item.title)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    if let artist = item.artist {
                        NavigationLink(destination: ArtistProfileView(artistId: artist.id)) {
                            HStack(spacing: 4) {
                                Image(systemName: "person.circle.fill")
                                    .font(.caption)
                                Text(artist.user?.email ?? "Unknown Artist")
                                    .font(.subheadline)
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                }
                
                Spacer()
            }
            
            // Audio Player
            if let audioUrl = item.audioUrl {
                CompactAudioPlayerView(track: Track(
                    id: item.id,
                    title: item.title,
                    audioUrl: audioUrl,
                    artistId: item.artist?.id ?? "",
                    likeCount: item.likeCount ?? 0,
                    createdAt: item.createdAt,
                    artist: item.artist,
                    isLiked: item.isLiked
                ))
            }
            
            // Engagement buttons
            HStack(spacing: 20) {
                // Like Button
                LikeButtonView(
                    trackId: item.id,
                    likeCount: item.likeCount ?? 0,
                    isLiked: item.isLiked ?? false
                )
                
                // Comment Button
                NavigationLink(destination: CommentsView(trackId: item.id)) {
                    HStack(spacing: 4) {
                        Image(systemName: "bubble.right")
                            .font(.system(size: 16))
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                // Timestamp
                Text(formatDate(item.createdAt))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
    }
    
    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: dateString) {
            let displayFormatter = RelativeDateTimeFormatter()
            displayFormatter.unitsStyle = .abbreviated
            return displayFormatter.localizedString(for: date, relativeTo: Date())
        }
        return dateString
    }
}

struct ArticleFeedItemView: View {
    let item: FeedItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Title
            Text(item.title)
                .font(.headline)
                .foregroundColor(.primary)
            
            // Content preview
            if let content = item.content {
                Text(content)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
            
            // Metadata
            HStack {
                if let city = item.city {
                    Label(city, systemImage: "location.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                if let author = item.author {
                    Text("by \(author.email)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Text(formatDate(item.createdAt))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
    }
    
    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: dateString) {
            let displayFormatter = RelativeDateTimeFormatter()
            displayFormatter.unitsStyle = .abbreviated
            return displayFormatter.localizedString(for: date, relativeTo: Date())
        }
        return dateString
    }
}

#Preview {
    ScrollView {
        LazyVStack {
            FeedItemView(item: FeedItem(
                id: "1",
                type: .track,
                title: "Sample Track",
                createdAt: ISO8601DateFormatter().string(from: Date()),
                audioUrl: "https://example.com/audio.mp3",
                likeCount: 42,
                isLiked: false,
                artist: nil,
                content: nil,
                city: nil,
                author: nil
            ))
        }
        .padding()
    }
}

