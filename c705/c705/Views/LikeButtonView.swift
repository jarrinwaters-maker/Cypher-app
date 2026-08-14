//
//  LikeButtonView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct LikeButtonView: View {
    let trackId: String
    let initialLikeCount: Int
    let initialIsLiked: Bool
    
    @StateObject private var viewModel: LikeViewModel
    
    init(trackId: String, likeCount: Int, isLiked: Bool = false) {
        self.trackId = trackId
        self.initialLikeCount = likeCount
        self.initialIsLiked = isLiked
        _viewModel = StateObject(wrappedValue: LikeViewModel(
            trackId: trackId,
            initialLikeCount: likeCount,
            initialIsLiked: isLiked
        ))
    }
    
    var body: some View {
        Button(action: {
            Task {
                await viewModel.toggleLike()
            }
        }) {
            HStack(spacing: 4) {
                Image(systemName: viewModel.isLiked ? "heart.fill" : "heart")
                    .foregroundColor(viewModel.isLiked ? .red : .secondary)
                    .font(.system(size: 16))
                
                Text("\(viewModel.likeCount)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .disabled(viewModel.isLoading)
        .opacity(viewModel.isLoading ? 0.6 : 1.0)
    }
}

#Preview {
    HStack {
        LikeButtonView(trackId: "1", likeCount: 42, isLiked: false)
        LikeButtonView(trackId: "2", likeCount: 100, isLiked: true)
    }
    .padding()
}

