//
//  CommentsView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct CommentsView: View {
    let trackId: String
    @StateObject private var viewModel: CommentsViewModel
    @Environment(\.dismiss) private var dismiss
    
    init(trackId: String) {
        self.trackId = trackId
        _viewModel = StateObject(wrappedValue: CommentsViewModel(trackId: trackId))
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Comments List
                if viewModel.comments.isEmpty && !viewModel.isLoading {
                    VStack(spacing: 16) {
                        Image(systemName: "bubble.left.and.bubble.right")
                            .font(.system(size: 50))
                            .foregroundColor(.secondary)
                        Text("No comments yet")
                            .foregroundColor(.secondary)
                        Text("Be the first to comment!")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 12) {
                            ForEach(viewModel.comments) { comment in
                                CommentRowView(comment: comment)
                            }
                            
                            if viewModel.isLoadingMore {
                                ProgressView()
                                    .padding()
                            } else if viewModel.hasMoreComments {
                                Button("Load More Comments") {
                                    Task {
                                        await viewModel.loadMoreComments()
                                    }
                                }
                                .padding()
                            }
                        }
                        .padding()
                    }
                }
                
                // Comment Input
                Divider()
                HStack(spacing: 12) {
                    TextField("Add a comment...", text: $viewModel.newCommentText, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(1...4)
                    
                    Button(action: {
                        Task {
                            await viewModel.postComment()
                        }
                    }) {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.title2)
                            .foregroundColor(viewModel.newCommentText.isEmpty ? .gray : .blue)
                    }
                    .disabled(viewModel.newCommentText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || viewModel.isPosting)
                }
                .padding()
                .background(Color(.systemBackground))
            }
            .navigationTitle("Comments")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .task {
                await viewModel.loadComments()
            }
            .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("OK") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }
}

struct CommentRowView: View {
    let comment: Comment
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // User Avatar
            Circle()
                .fill(Color.blue.opacity(0.3))
                .frame(width: 40, height: 40)
                .overlay(
                    Text(String((comment.user?.email.prefix(1) ?? "U").uppercased()))
                        .font(.caption)
                        .foregroundColor(.blue)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                // User name
                Text(comment.user?.email ?? "Unknown User")
                    .font(.subheadline)
                    .bold()
                
                // Comment text
                Text(comment.content)
                    .font(.body)
                
                // Timestamp
                Text(formatDate(comment.createdAt))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding(.vertical, 4)
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
    CommentsView(trackId: "track-id")
}

