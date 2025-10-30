# JSON Tree Visualizer

This project is a simple and intuitive tool for visualizing JSON data as
a tree structure.\
It helps developers understand nested JSON easily by turning it into a
connected, color-coded flow diagram.

## What It Does

-   Accepts pasted or typed JSON input
-   Validates and parses JSON
-   Converts JSON into a tree of nodes using React Flow
-   Highlights different data types (objects, arrays, primitives)
-   Allows zooming, panning, and fitting the view
-   Supports JSON path search (e.g., `$.user.address.city`)
-   Lets you reset input and clear the tree
-   Light and dark theme options
-   Option to download the tree as an image

## How It Works

1.  You input JSON in the text panel
2.  The app checks if the JSON is valid
3.  The data is converted into a hierarchy of nodes and edges
4.  React Flow renders the tree visually
5.  Search allows targeting specific keys or values through JSON paths

## Built With

-   React
-   React Flow
-   Tailwind / CSS
-   Vite / CRA / Next.js (any build option)
-   Deployed via Vercel / Netlify / GitHub Pages

## Why This Tool Exists

Working with large or deeply nested JSON structures can be difficult
when reading raw text.\
This tool provides a clear visual representation, making it easier to:

-   Explore API responses
-   Understand configuration files
-   Debug data issues
-   Demonstrate JSON structures to others

## Future Improvements

-   Drag-and-drop JSON file upload
-   Collapsible branches in the tree
-   Local theme preference storage
-   Keyboard shortcuts
-   Export as SVG or PDF

## Author

**Harsh Rajput**\
Full-Stack Developer (React, .NET Core, Next.js, Ruby on Rails)

GitHub \| LinkedIn
