"""
Core EDA - Size Distribution Analysis (Matplotlib)
=================================================

This example demonstrates how to create size distribution visualizations
using Matplotlib for core EDA analysis.
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle

def create_size_distribution_matplotlib(widths, heights, aspect_ratios):
    """
    Create size distribution visualization using Matplotlib
    
    Args:
        widths (list): Image widths
        heights (list): Image heights  
        aspect_ratios (list): Aspect ratios
        
    Returns:
        matplotlib.figure.Figure: Matplotlib figure
    """
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Image Size Distribution Analysis', fontsize=16, fontweight='bold')
    
    # 1. Width Distribution
    axes[0, 0].hist(widths, bins=30, alpha=0.7, color='lightblue', edgecolor='black')
    axes[0, 0].set_title('Width Distribution')
    axes[0, 0].set_xlabel('Width (px)')
    axes[0, 0].set_ylabel('Count')
    axes[0, 0].grid(True, alpha=0.3)
    
    # 2. Height Distribution
    axes[0, 1].hist(heights, bins=30, alpha=0.7, color='lightgreen', edgecolor='black')
    axes[0, 1].set_title('Height Distribution')
    axes[0, 1].set_xlabel('Height (px)')
    axes[0, 1].set_ylabel('Count')
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. Aspect Ratio Distribution
    axes[1, 0].hist(aspect_ratios, bins=30, alpha=0.7, color='lightcoral', edgecolor='black')
    axes[1, 0].set_title('Aspect Ratio Distribution')
    axes[1, 0].set_xlabel('Aspect Ratio')
    axes[1, 0].set_ylabel('Count')
    axes[1, 0].grid(True, alpha=0.3)
    
    # 4. Size Scatter Plot
    scatter = axes[1, 1].scatter(widths, heights, alpha=0.6, s=4, c='blue')
    axes[1, 1].set_title('Size Scatter Plot')
    axes[1, 1].set_xlabel('Width (px)')
    axes[1, 1].set_ylabel('Height (px)')
    axes[1, 1].grid(True, alpha=0.3)
    
    # Adjust layout
    plt.tight_layout()
    
    return fig

def create_marginal_plot_matplotlib(widths, heights):
    """
    Create marginal plot showing size distribution
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: Marginal plot figure
    """
    
    # Create figure with subplots
    fig = plt.figure(figsize=(10, 8))
    
    # Create grid layout
    gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)
    
    # Main scatter plot
    ax_main = fig.add_subplot(gs[1, 0])
    ax_main.scatter(widths, heights, alpha=0.6, s=4, c='blue')
    ax_main.set_xlabel('Width (px)')
    ax_main.set_ylabel('Height (px)')
    ax_main.set_title('Image Size Distribution')
    ax_main.grid(True, alpha=0.3)
    
    # Width histogram (top)
    ax_width = fig.add_subplot(gs[0, 0])
    ax_width.hist(widths, bins=30, alpha=0.7, color='lightblue', edgecolor='black')
    ax_width.set_ylabel('Count')
    ax_width.set_title('Width Distribution')
    ax_width.grid(True, alpha=0.3)
    
    # Height histogram (right)
    ax_height = fig.add_subplot(gs[1, 1])
    ax_height.hist(heights, bins=30, alpha=0.7, color='lightgreen', 
                   edgecolor='black', orientation='horizontal')
    ax_height.set_xlabel('Count')
    ax_height.set_title('Height Distribution')
    ax_height.grid(True, alpha=0.3)
    
    # Remove empty subplot
    fig.delaxes(fig.add_subplot(gs[0, 1]))
    
    return fig

def create_heatmap_matplotlib(widths, heights):
    """
    Create 2D histogram heatmap of size distribution
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: Heatmap figure
    """
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create 2D histogram
    hist, xedges, yedges = np.histogram2d(widths, heights, bins=20)
    
    # Create heatmap
    im = ax.imshow(hist.T, origin='lower', aspect='auto', 
                   extent=[xedges[0], xedges[-1], yedges[0], yedges[-1]],
                   cmap='Blues')
    
    # Add colorbar
    cbar = plt.colorbar(im, ax=ax)
    cbar.set_label('Count')
    
    # Set labels and title
    ax.set_xlabel('Width (px)')
    ax.set_ylabel('Height (px)')
    ax.set_title('Image Size Distribution Heatmap')
    
    return fig

# Example usage
if __name__ == "__main__":
    # Sample data
    np.random.seed(42)
    widths = np.random.normal(500, 100, 1000)
    heights = np.random.normal(375, 75, 1000)
    aspect_ratios = widths / heights
    
    # Create plots
    fig1 = create_size_distribution_matplotlib(widths, heights, aspect_ratios)
    fig2 = create_marginal_plot_matplotlib(widths, heights)
    fig3 = create_heatmap_matplotlib(widths, heights)
    
    # Show plots
    plt.show()
