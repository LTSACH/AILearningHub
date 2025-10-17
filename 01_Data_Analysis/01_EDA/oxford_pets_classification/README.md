# Oxford-IIIT Pets Classification - Exploratory Data Analysis

🐕 🐈 **Image Classification EDA** - Comprehensive analysis of the Oxford-IIIT Pets Dataset

---

## 📊 Quick Links

- **[View Index Page](index.html)** - Project overview and navigation
- **[Core EDA Report](eda_report_core.html)** - Dataset statistics and image analysis
- **[Classification EDA Report](eda_report_classification.html)** - Breed analysis and feature visualization

---

## 📁 Project Contents

### Reports
- `index.html` - Landing page with project overview
- `eda_report_core.html` (100KB) - Core dataset analysis
- `eda_report_classification.html` (160KB+) - Classification-specific analysis

### Sample Images
- `sample_images/` - 370 representative images (37MB)
  - `cats/` - 120 cat images (12 breeds)
  - `dogs/` - 250 dog images (25 breeds)

### Metadata
- `sample_metadata.json` - Statistics about sample selection
- `sample_gallery.json` - Organized image gallery data
- `sample_images_mapping.json` - Path mappings for images
- `ATTRIBUTION.md` - Dataset attribution and citation

---

## 🎯 Dataset Overview

**Oxford-IIIT Pets Dataset**
- **Total Images** (full dataset): 7,349
- **Sample Images** (this demo): 370 (~5%)
- **Breeds**: 37 (12 cats + 25 dogs)
- **Tasks Supported**: Classification, Detection, Segmentation

**Sample Selection Strategy**:
- Stratified sampling by breed
- ~10 images per breed
- Balanced representation of species
- Reproducible selection (seed-based)

---

## 📈 Report Features

### Core EDA Report
✅ Image dimension analysis  
✅ File size distribution  
✅ Aspect ratio statistics  
✅ Color channel distributions  
✅ Sample image gallery (6/breed)  
✅ Interactive histograms

### Classification EDA Report
✅ Class distribution (37 breeds)  
✅ Species breakdown (cats vs dogs)  
✅ Class balance analysis  
✅ Feature extraction (ResNet50)  
✅ Breed similarity matrix (37×37)  
✅ Hierarchical clustering  
✅ Sample gallery (4/breed)  
✅ Interactive visualizations

---

## 🔧 Technical Details

**Data Format**: CSV-based metadata with 11 columns per image  
**Feature Extraction**: ResNet50 (pretrained on ImageNet)  
**Dimensionality Reduction**: t-SNE, UMAP, PCA  
**Clustering**: Hierarchical clustering (5 groups)  
**Visualizations**: Chart.js + Plotly  
**Styling**: Modern, responsive, mobile-friendly

---

## 📊 Sample Statistics

```
Total Sample Images: 370
Breeds: 37 (100% coverage)
Cats: 120 (32.4%)
Dogs: 250 (67.6%)
Total Size: ~37 MB
```

**Per-Breed Distribution**:
- Minimum: 10 images per breed
- Maximum: 10 images per breed
- Strategy: Equal representation

---

## 📖 Citation & Attribution

This demonstration uses representative samples from the **Oxford-IIIT Pet Dataset**.

**Citation**:
```bibtex
@InProceedings{parkhi12a,
  author       = "Parkhi, O. M. and Vedaldi, A. and Zisserman, A. and Jawahar, C.~V.",
  title        = "Cats and Dogs",
  booktitle    = "IEEE Conference on Computer Vision and Pattern Recognition",
  year         = "2012",
}
```

**Full Dataset**: https://www.robots.ox.ac.uk/~vgg/data/pets/

See [`ATTRIBUTION.md`](ATTRIBUTION.md) for complete attribution details.

---

## 🚀 Usage

### View Locally
```bash
# Open in browser
open index.html
open eda_report_core.html
open eda_report_classification.html
```

### Deploy to GitHub Pages
```bash
# Already in correct format for gh-pages
# Just commit to gh-pages branch
git add .
git commit -m "Add Oxford Pets EDA with sample images"
git push origin gh-pages
```

---

## 📁 File Structure

```
oxford_pets_classification/
├── index.html                      # Landing page
├── eda_report_core.html           # Core analysis
├── eda_report_classification.html # Classification analysis
├── README.md                      # This file
├── ATTRIBUTION.md                 # Dataset attribution
├── sample_metadata.json           # Sample statistics
├── sample_gallery.json            # Gallery organization
├── sample_images_mapping.json     # Path mappings
└── sample_images/                 # 370 images (37MB)
    ├── cats/                      # 120 cat images
    │   ├── Abyssinian_*.jpg
    │   ├── Bengal_*.jpg
    │   └── ...
    └── dogs/                      # 250 dog images
        ├── beagle_*.jpg
        ├── pug_*.jpg
        └── ...
```

---

## ✨ Highlights

🎨 **Beautiful Visualizations** - Professional-quality charts and plots  
📊 **Interactive Elements** - Hover, zoom, filter capabilities  
🖼️ **Image Galleries** - Organized by breed with lazy loading  
📱 **Responsive Design** - Works on desktop, tablet, mobile  
🚀 **Fast Loading** - Optimized HTML, external CSS/JS  
📝 **Well-Documented** - Clear explanations and insights  

---

## 🎓 Educational Purpose

This project demonstrates:
- **Exploratory Data Analysis** techniques for image datasets
- **Feature extraction** using pre-trained deep learning models
- **Dimensionality reduction** and visualization
- **Similarity analysis** and clustering
- **Modern web development** for data presentation
- **Best practices** for dataset attribution and licensing

---

## 🔗 Links

- **GitHub Repository**: https://github.com/LTSACH/AILearningHub
- **Original Dataset**: https://www.robots.ox.ac.uk/~vgg/data/pets/
- **Other EDA Projects**:
  - [BBC News Text Classification](../bbcnews_text_classification/)
  - [Adult Income Tabular Data](../adult_income_tabular/)

---

## 📞 Contact

For questions about this EDA demonstration, please open an issue in the repository.  
For questions about the dataset itself, contact the Visual Geometry Group at Oxford.

---

**Last Updated**: January 2025  
**Project Type**: Educational / Portfolio  
**License**: Sample images used under educational fair use  
**Status**: ✅ Complete and ready for gh-pages

