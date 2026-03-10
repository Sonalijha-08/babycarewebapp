import React, { useState } from 'react';
import './Tips.css';

export default function Tips() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTip, setExpandedTip] = useState(null);

  const categories = [
    { id: 'all', name: 'All Tips', icon: '📚' },
    { id: 'feeding', name: 'Feeding', icon: '🍼' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'development', name: 'Development', icon: '👶' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' }
  ];

  const tips = [
    {
      id: 1,
      category: 'feeding',
      title: 'Breastfeeding Basics',
      summary: 'Essential tips for successful breastfeeding',
      content: 'Ensure proper latch by positioning baby\'s mouth wide open. Feed on demand, typically 8-12 times per day for newborns. Stay hydrated and maintain a balanced diet. Look for signs of hunger like rooting and sucking motions.',
      ageRange: '0-6 months',
      difficulty: 'Beginner',
      readTime: '3 min'
    },
    {
      id: 2,
      category: 'sleep',
      title: 'Creating a Sleep Routine',
      summary: 'Establish healthy sleep patterns for your baby',
      content: 'Create a consistent bedtime routine including bath, feeding, and lullabies. Keep the room dark and quiet. Put baby down drowsy but awake. Maintain consistent sleep and wake times. Swaddle safely for newborns.',
      ageRange: '0-12 months',
      difficulty: 'Intermediate',
      readTime: '4 min'
    },
    {
      id: 3,
      category: 'health',
      title: 'Vaccination Schedule',
      summary: 'Understanding your baby\'s immunization timeline',
      content: 'Follow recommended vaccination schedule starting at birth. Keep a vaccination record. Watch for mild side effects like fussiness or low fever. Contact pediatrician if serious reactions occur. Never skip vaccines without medical advice.',
      ageRange: '0-24 months',
      difficulty: 'Important',
      readTime: '5 min'
    },
    {
      id: 4,
      category: 'development',
      title: 'Tummy Time Benefits',
      summary: 'Why tummy time is crucial for development',
      content: 'Start tummy time from day one, 2-3 times daily. Begin with 3-5 minutes and gradually increase. Helps strengthen neck, shoulder, and arm muscles. Prevents flat spots on head. Makes crawling easier later.',
      ageRange: '0-6 months',
      difficulty: 'Beginner',
      readTime: '3 min'
    },
    {
      id: 5,
      category: 'safety',
      title: 'Safe Sleep Environment',
      summary: 'Creating a safe sleeping space for your baby',
      content: 'Always place baby on back to sleep. Use firm mattress with fitted sheet. Keep crib free of toys, pillows, and blankets. Room temperature should be comfortable. Consider room-sharing for first 6 months.',
      ageRange: '0-12 months',
      difficulty: 'Critical',
      readTime: '4 min'
    },
    {
      id: 6,
      category: 'nutrition',
      title: 'Introducing Solid Foods',
      summary: 'When and how to start solid foods',
      content: 'Start around 6 months when baby shows readiness signs. Begin with iron-fortified cereals or pureed vegetables. Introduce one food at a time, waiting 3-5 days. Watch for allergic reactions. Continue breast milk or formula.',
      ageRange: '6-12 months',
      difficulty: 'Intermediate',
      readTime: '5 min'
    },
    {
      id: 7,
      category: 'feeding',
      title: 'Bottle Feeding Tips',
      summary: 'Best practices for bottle feeding',
      content: 'Hold baby semi-upright during feeding. Never prop the bottle. Allow baby to set the pace. Watch for fullness cues. Burp baby during and after feeding. Clean and sterilize bottles properly.',
      ageRange: '0-12 months',
      difficulty: 'Beginner',
      readTime: '3 min'
    },
    {
      id: 8,
      category: 'development',
      title: 'Language Development',
      summary: 'Supporting your baby\'s communication skills',
      content: 'Talk to your baby frequently. Read books daily. Respond to coos and babbles. Use simple, clear words. Name objects and actions. Sing songs and nursery rhymes. Make eye contact while talking.',
      ageRange: '0-24 months',
      difficulty: 'Ongoing',
      readTime: '4 min'
    },
    {
      id: 9,
      category: 'health',
      title: 'Common Cold Management',
      summary: 'How to care for baby with a cold',
      content: 'Keep baby hydrated with breast milk or formula. Use saline drops for stuffy nose. Run a cool-mist humidifier. Elevate head slightly during sleep. Monitor temperature. Call doctor if symptoms worsen or fever persists.',
      ageRange: '0-24 months',
      difficulty: 'Important',
      readTime: '4 min'
    },
    {
      id: 10,
      category: 'safety',
      title: 'Childproofing Your Home',
      summary: 'Essential safety measures for your home',
      content: 'Install outlet covers and cabinet locks. Secure furniture to walls. Keep small objects out of reach. Use safety gates for stairs. Store chemicals and medications safely. Check water temperature before bath.',
      ageRange: '6-24 months',
      difficulty: 'Critical',
      readTime: '6 min'
    }
  ];

  // Filter tips based on category and search query
  const filteredTips = tips.filter((tip) => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      tip.title.toLowerCase().includes(searchLower) ||
      tip.summary.toLowerCase().includes(searchLower) ||
      tip.content.toLowerCase().includes(searchLower) ||
      tip.category.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'green',
      'Intermediate': 'blue',
      'Important': 'orange',
      'Critical': 'red',
      'Ongoing': 'purple'
    };
    return colors[difficulty] || 'gray';
  };

  return (
    <div className="tips-container">
      <header className="tips-header">
        <div className="header-content">
          <h1>💡 Tips & Guidance</h1>
          <p>Expert advice for your parenting journey</p>
        </div>
      </header>

      <div className="tips-content">
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tips and guidance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="categories-section">
          <h2>Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tips-section">
          <div className="tips-grid">
            {filteredTips.map(tip => (
              <div key={tip.id} className="tip-card">
                <div className="tip-header">
                  <span className={`difficulty-badge ${getDifficultyColor(tip.difficulty)}`}>
                    {tip.difficulty}
                  </span>
                  <span className="age-range">{tip.ageRange}</span>
                </div>
                
                <h3>{tip.title}</h3>
                <p className="tip-summary">{tip.summary}</p>
                
                {expandedTip === tip.id && (
                  <div className="tip-content-expanded">
                    <p>{tip.content}</p>
                  </div>
                )}
                
                <div className="tip-footer">
                  <span className="read-time">📖 {tip.readTime}</span>
                  <button 
                    className="expand-btn"
                    onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                  >
                    {expandedTip === tip.id ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTips.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No tips found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        <div className="resources-section">
          <h2>📚 Featured Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <span className="resource-icon">📱</span>
              <h4>Emergency Contacts</h4>
              <p>Keep important numbers handy</p>
              <button className="resource-btn">View</button>
            </div>
            <div className="resource-card">
              <span className="resource-icon">📊</span>
              <h4>Growth Milestones</h4>
              <p>Track developmental progress</p>
              <button className="resource-btn">View</button>
            </div>
            <div className="resource-card">
              <span className="resource-icon">🩺</span>
              <h4>Health Checklist</h4>
              <p>Regular health monitoring guide</p>
              <button className="resource-btn">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
