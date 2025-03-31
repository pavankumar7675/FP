# Placement Dashboard

A comprehensive web-based dashboard for visualizing and analyzing placement statistics across different branches, companies, and sectors.

## Features

- 📊 **Interactive Visualizations**

  - Company-wise placement statistics
  - Branch-wise placement analysis
  - Sector-wise distribution charts
  - Salary distribution analysis
  - Placement rate trends

- 📈 **Data Analysis**

  - Real-time data processing
  - Year-wise comparison
  - Consolidated statistics
  - Detailed breakdowns

- 🎨 **Modern UI/UX**
  - Responsive design
  - Interactive charts
  - Clean and intuitive interface
  - Smooth transitions and animations

## Tech Stack

### Frontend

- React.js
- Recharts for data visualization
- CSS3 with modern styling
- Axios for API calls

### Backend

- Node.js
- Express.js
- CORS enabled
- JSON data processing

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/placement-dashboard.git
cd placement-dashboard
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../backend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

The server will run on `http://localhost:9000`

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
placement-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   └── CSS files
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── server.js
│   ├── data/
│   │   ├── placements_2024.json
│   │   └── Placement_Data2024.json
│   └── package.json
└── README.md
```

## API Endpoints

### GET /api/placements/:year

Returns placement data for the specified year.

Response format:

```json
{
  "Branch-Wise": [...],
  "Company-Wise": [...],
  "Consolidated": [...]
}
```

## Data Structure

### Company Data

```json
{
  "COMPANY": "Company Name",
  "SECTOR": "Sector Name",
  "SALARY": "Salary in LPA",
  "PLACED": "Number of Students Placed",
  "BRANCHES": "List of Branches"
}
```

### Branch Data

```json
{
  "BRANCH": "Branch Name",
  "REGISTERED ELIGIBLE": "Number of Eligible Students",
  "PLACED": "Number of Placed Students",
  "PLACEMENT RATE": "Placement Percentage"
}
```

### Consolidated Data

```json
{
  "SECTOR": "Sector Name",
  "COMPANIES": "Number of Companies",
  "PLACED": "Total Students Placed",
  "AVG_SALARY": "Average Salary",
  "TOTAL_SALARY": "Total Salary"
}
```

## Features in Detail

### 1. Summary Statistics

- Total eligible students
- Total placed students
- Overall placement percentage

### 2. Company-wise Analysis

- Placement distribution
- Salary details
- Branch-wise recruitment
- Interactive bar charts

### 3. Branch-wise Analysis

- Placement rates
- Eligible vs. placed students
- Year-wise trends
- Line and area charts

### 4. Sector-wise Analysis

- Sector distribution
- Salary distribution
- Company distribution
- Pie and bar charts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Performance Optimization

- Memoized data processing using `useMemo`
- Efficient data structures for processing
- Optimized chart rendering
- Lazy loading of components
- Responsive design for all screen sizes

## Error Handling

- API error handling
- Data validation
- Loading states
- Error messages
- Fallback UI components

## Future Enhancements

- [ ] Add authentication system
- [ ] Implement data export functionality
- [ ] Add more interactive features
- [ ] Include historical data comparison
- [ ] Add custom date range selection
- [ ] Implement data filtering options
- [ ] Add print/PDF export
- [ ] Include more detailed analytics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Recharts library for visualization
- React.js community
- All contributors and maintainers

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/placement-dashboard](https://github.com/yourusername/placement-dashboard)
