"""
Core EDA - Size Distribution Analysis (Seaborn)
===============================================

This example demonstrates how to create size distribution visualizations
using Seaborn for core EDA analysis.
"""

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def create_size_distribution_seaborn(widths, heights, aspect_ratios):
    """
    Create size distribution visualization using Seaborn
    
    Args:
        widths (list): Image widths
        heights (list): Image heights  
        aspect_ratios (list): Aspect ratios
        
    Returns:
        matplotlib.figure.Figure: Seaborn figure
    """
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Image Size Distribution Analysis', fontsize=16, fontweight='bold')
    
    # 1. Width Distribution
    sns.histplot(data=widths, bins=30, ax=axes[0, 0], color='lightblue', alpha=0.7)
    axes[0, 0].set_title('Width Distribution')
    axes[0, 0].set_xlabel('Width (px)')
    axes[0, 0].set_ylabel('Count')
    
    # 2. Height Distribution
    sns.histplot(data=heights, bins=30, ax=axes[0, 1], color='lightgreen', alpha=0.7)
    axes[0, 1].set_title('Height Distribution')
    axes[0, 1].set_xlabel('Height (px)')
    axes[0, 1].set_ylabel('Count')
    
    # 3. Aspect Ratio Distribution
    sns.histplot(data=aspect_ratios, bins=30, ax=axes[1, 0], color='lightcoral', alpha=0.7)
    axes[1, 0].set_title('Aspect Ratio Distribution')
    axes[1, 0].set_xlabel('Aspect Ratio')
    axes[1, 0].set_ylabel('Count')
    
    # 4. Size Scatter Plot
    sns.scatterplot(x=widths, y=heights, ax=axes[1, 1], alpha=0.6, s=4, color='blue')
    axes[1, 1].set_title('Size Scatter Plot')
    axes[1, 1].set_xlabel('Width (px)')
    axes[1, 1].set_ylabel('Height (px)')
    
    # Adjust layout
    plt.tight_layout()
    
    return fig

def create_marginal_plot_seaborn(widths, heights):
    """
    Create marginal plot showing size distribution using Seaborn
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: Marginal plot figure
    """
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create figure
    fig = plt.figure(figsize=(10, 8))
    
    # Create joint plot
    g = sns.jointplot(x=widths, y=heights, kind='scatter', 
                     alpha=0.6, s=4, color='blue', height=8)
    
    # Set labels
    g.set_axis_labels('Width (px)', 'Height (px)')
    g.fig.suptitle('Image Size Distribution with Marginal Plots', y=1.02)
    
    return g.fig

def create_heatmap_seaborn(widths, heights):
    """
    Create 2D histogram heatmap of size distribution using Seaborn
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: Heatmap figure
    """
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create 2D histogram
    sns.histplot(x=widths, y=heights, bins=20, ax=ax, cmap='Blues')
    
    # Set labels and title
    ax.set_xlabel('Width (px)')
    ax.set_ylabel('Height (px)')
    ax.set_title('Image Size Distribution Heatmap')
    
    return fig

def create_kde_plot_seaborn(widths, heights):
    """
    Create KDE plot showing density of size distribution
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: KDE plot figure
    """
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create KDE plot
    sns.kdeplot(x=widths, y=heights, ax=ax, cmap='Blues', fill=True)
    
    # Set labels and title
    ax.set_xlabel('Width (px)')
    ax.set_ylabel('Height (px)')
    ax.set_title('Image Size Distribution Density (KDE)')
    
    return fig

def create_violin_plot_seaborn(widths, heights):
    """
    Create violin plot showing distribution of sizes
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        matplotlib.figure.Figure: Violin plot figure
    """
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create DataFrame
    df = pd.DataFrame({
        'Width': widths,
        'Height': heights
    })
    
    # Create figure
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))
    
    # Width violin plot
    sns.violinplot(data=df, y='Width', ax=axes[0], color='lightblue')
    axes[0].set_title('Width Distribution')
    axes[0].set_ylabel('Width (px)')
    
    # Height violin plot
    sns.violinplot(data=df, y='Height', ax=axes[1], color='lightgreen')
    axes[1].set_title('Height Distribution')
    axes[1].set_ylabel('Height (px)')
    
    plt.suptitle('Image Size Distribution (Violin Plots)', fontsize=16, fontweight='bold')
    plt.tight_layout()
    
    return fig

# Example usage
if __name__ == "__main__":
    # Sample data
    np.random.seed(42)
    widths = np.random.normal(500, 100, 1000)
    heights = np.random.normal(375, 75, 1000)
    aspect_ratios = widths / heights
    
    # Create plots
    fig1 = create_size_distribution_seaborn(widths, heights, aspect_ratios)
    fig2 = create_marginal_plot_seaborn(widths, heights)
    fig3 = create_heatmap_seaborn(widths, heights)
    fig4 = create_kde_plot_seaborn(widths, heights)
    fig5 = create_violin_plot_seaborn(widths, heights)
    
    # Show plots
    plt.show()
