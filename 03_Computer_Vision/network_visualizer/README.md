# 🔍 Network Architecture Visualizer

Interactive visualization tool for CNN and Vision Transformer architectures. This tool helps students and researchers understand the structure and components of deep learning networks through visual representations.

## 🌟 Features

- **Interactive Architecture Visualization** - Click to explore layer details
- **CNN Support** - ResNet, VGG, EfficientNet, MobileNet architectures
- **Vision Transformer Support** - ViT, Swin Transformer, DeiT architectures
- **Architecture Comparison** - Side-by-side comparison of different networks
- **Export Functionality** - Export visualizations as images
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Information** - Parameter counts, FLOPs, and layer details

## 🚀 Quick Start

1. **Open the Visualizer**
   - Navigate to the Network Visualizer page
   - Choose between CNN or Vision Transformer architectures

2. **Explore Architectures**
   - Click on architecture cards to view details
   - Use the interactive visualization to explore layers
   - Hover over components for detailed information

3. **Compare Networks**
   - Select two architectures for comparison
   - View parameter counts, FLOPs, and other metrics
   - Analyze differences between architectures

## 📊 Supported Architectures

### CNN Architectures
- **ResNet-50** - Residual Network with skip connections
- **VGG-16** - Very Deep Convolutional Networks
- **EfficientNet-B0** - Compound scaling for efficiency
- **MobileNet-V2** - Mobile-optimized with inverted residuals

### Vision Transformers
- **ViT-Base** - Base Vision Transformer with 12 blocks
- **ViT-Large** - Large Vision Transformer with 24 blocks
- **Swin Transformer** - Shifted windows for efficient vision
- **DeiT** - Data-efficient Image Transformer

## 🛠️ Technical Details

### Architecture Data Structure
Each architecture is defined with:
- **Basic Information** - Name, type, year, parameters, FLOPs
- **Layer Details** - Individual layer specifications
- **Visualization Data** - Layout and connection information

### Visualization Engine
- **D3.js** - For interactive SVG visualizations
- **Responsive Design** - Adapts to different screen sizes
- **Zoom and Pan** - Navigate large architectures
- **Tooltips** - Contextual information on hover

## 📁 File Structure

```
network_visualizer/
├── index.html                 # Main application page
├── README.md                  # This documentation
├── assets/
│   ├── css/
│   │   ├── common.css         # Common styles
│   │   └── network-visualizer.css  # Visualizer-specific styles
│   ├── js/
│   │   ├── utils.js           # Utility functions
│   │   ├── network-visualizer.js  # Main application logic
│   │   ├── cnn-visualizer.js  # CNN visualization engine
│   │   └── vit-visualizer.js  # ViT visualization engine
│   └── data/
│       ├── cnn-architectures.json  # CNN architecture data
│       └── vit-architectures.json  # ViT architecture data
└── examples/                  # Example pages (future)
```

## 🎯 Usage Examples

### Basic Visualization
```javascript
// Initialize the visualizer
const visualizer = new NetworkVisualizer();
await visualizer.init();

// Load a specific architecture
visualizer.handleArchitectureSelect('resnet50');
```

### Architecture Comparison
```javascript
// Compare two architectures
visualizer.compareArchitectures('resnet50', 'vgg16');
```

### Export Visualization
```javascript
// Export current visualization as image
visualizer.exportImage('my-architecture');
```

## 🔧 Customization

### Adding New Architectures
1. **Create Architecture Data**
   ```json
   {
     "id": "my-architecture",
     "name": "My Custom Architecture",
     "type": "cnn",
     "year": 2024,
     "parameters": 1000000,
     "flops": 500000000,
     "inputSize": "224×224×3",
     "outputClasses": 1000,
     "description": "My custom CNN architecture",
     "layers": [...]
   }
   ```

2. **Add to Data File**
   - Add the architecture to `cnn-architectures.json` or `vit-architectures.json`

3. **Test Visualization**
   - Reload the page and select your architecture

### Customizing Visualizations
- **Colors** - Modify color schemes in CSS files
- **Layout** - Adjust positioning in visualization engines
- **Interactions** - Add custom event handlers

## 🎨 Styling

### CSS Classes
- `.architecture-card` - Architecture selection cards
- `.visualization-canvas` - Main visualization area
- `.layer-rect` - Individual layer rectangles
- `.connection` - Connections between layers

### Color Scheme
- **Primary**: #667eea (Blue)
- **Secondary**: #764ba2 (Purple)
- **Accent**: #ff6b6b (Red)
- **Background**: #f8f9fa (Light Gray)

## 📱 Responsive Design

The visualizer adapts to different screen sizes:
- **Desktop** - Full interactive experience
- **Tablet** - Optimized layout for touch
- **Mobile** - Simplified interface for small screens

## 🔍 Browser Support

- **Chrome** 80+ ✅
- **Firefox** 75+ ✅
- **Safari** 13+ ✅
- **Edge** 80+ ✅

## 🚀 Performance

- **Lazy Loading** - Architectures loaded on demand
- **Efficient Rendering** - Optimized D3.js visualizations
- **Memory Management** - Proper cleanup of event listeners
- **Smooth Animations** - Hardware-accelerated transitions

## 🐛 Troubleshooting

### Common Issues

1. **Visualization Not Loading**
   - Check browser console for errors
   - Ensure all data files are accessible
   - Verify D3.js is loaded correctly

2. **Architecture Not Found**
   - Check architecture ID in data files
   - Verify JSON format is valid
   - Clear browser cache and reload

3. **Export Not Working**
   - Ensure browser supports canvas operations
   - Check for CORS issues with local files
   - Try different export format

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL for additional logging.

## 📚 Learning Resources

### CNN Concepts
- **Convolutional Layers** - Feature extraction
- **Pooling Layers** - Dimensionality reduction
- **Skip Connections** - Gradient flow improvement
- **Batch Normalization** - Training stability

### Vision Transformer Concepts
- **Patch Embedding** - Image to sequence conversion
- **Multi-Head Attention** - Global feature interactions
- **Positional Encoding** - Spatial information
- **Transformer Blocks** - Self-attention mechanisms

## 🤝 Contributing

### Adding New Features
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

### Reporting Issues
- Use the issue tracker
- Provide detailed reproduction steps
- Include browser and device information
- Attach screenshots if applicable

## 📄 License

This project is part of the AI Learning Hub and is available for educational use.

## 👨‍💻 Author

Created by [LTSACH](https://github.com/LTSACH) - AI Education Enthusiast

---

## 🔗 Related Projects

- [AI Learning Hub](https://github.com/LTSACH/AILearningHub) - Main educational platform
- [Computer Vision Tutorials](../) - Related CV learning materials
- [Machine Learning Resources](../../02_Machine_Learning/) - ML algorithms and techniques

---

⭐ **Star this repository** if you find the Network Visualizer helpful for your AI learning journey!
