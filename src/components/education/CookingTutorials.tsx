'use client';

import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { PlayArrow, Search } from '@mui/icons-material';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  category: string;
  duration: string;
  url: string;
}

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string }
    };
  };
  contentDetails?: {
    duration: string;
  };
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Basic Knife Skills',
    description: 'Learn essential knife skills and cutting techniques from Gordon Ramsay.',
    thumbnail: 'https://i.ytimg.com/vi/-av6cz9upO0/hqdefault.jpg',
    videoId: '-av6cz9upO0',
    category: 'Basic Skills',
    duration: '6:12',
    url: 'https://www.youtube.com/watch?v=-av6cz9upO0'
  },
  {
    id: '2',
    title: 'Perfect Rice Cooking Guide',
    description: 'Learn how to cook fluffy rice perfectly every time.',
    thumbnail: 'https://i.ytimg.com/vi/Jf75I9LKhvg/hqdefault.jpg',
    videoId: 'Jf75I9LKhvg',
    category: 'Basic Skills',
    duration: '5:15',
    url: 'https://www.youtube.com/watch?v=Jf75I9LKhvg'
  },
  {
    id: '3',
    title: 'Stock Making Basics',
    description: 'Learn how to make perfect chicken, beef, and vegetable stocks from America\'s Test Kitchen.',
    thumbnail: 'https://i.ytimg.com/vi/V23HlsUdbaM/hqdefault.jpg',
    videoId: 'V23HlsUdbaM',
    category: 'Advanced Techniques',
    duration: '8:47',
    url: 'https://www.youtube.com/watch?v=V23HlsUdbaM'
  },
  {
    id: '4',
    title: 'Bread Baking Basics',
    description: 'Simple no-knead bread recipe for beginners.',
    thumbnail: 'https://i.ytimg.com/vi/13Ah9ES2yTU/hqdefault.jpg',
    videoId: '13Ah9ES2yTU',
    category: 'Baking',
    duration: '8:16',
    url: 'https://www.youtube.com/watch?v=13Ah9ES2yTU'
  },
  {
    id: '5',
    title: 'Vegetable Cutting Techniques',
    description: 'Master basic vegetable cuts used by professional chefs.',
    thumbnail: 'https://i.ytimg.com/vi/JMA2SqaDgG8/hqdefault.jpg',
    videoId: 'JMA2SqaDgG8',
    category: 'Basic Skills',
    duration: '9:27',
    url: 'https://www.youtube.com/watch?v=JMA2SqaDgG8'
  }
];

export default function CookingTutorials() {
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tutorial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleVideoClick = (tutorial: Tutorial) => {
    setSelectedVideo(tutorial);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(searchQuery + ' cooking tutorial')}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      const formattedResults: Tutorial[] = data.items.map((item: YouTubeSearchResult) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId,
        category: 'Search Results',
        duration: item.contentDetails?.duration || '',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to fetch search results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const categories = Array.from(new Set(tutorials.map(tutorial => tutorial.category)));

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Video Tutorials
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for cooking tutorials..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} disabled={isSearching}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={isSearching}
        />
        {searchError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {searchError}
          </Typography>
        )}
      </Box>

      {searchResults.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {searchResults.map((tutorial) => (
              <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={tutorial.thumbnail}
                    alt={tutorial.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    p: '16px !important',
                    '&:last-child': { p: '16px !important' }
                  }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      {tutorial.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tutorial.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PlayArrow />}
                        onClick={() => handleVideoClick(tutorial)}
                        size="small"
                      >
                        Watch Tutorial
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Curated Tutorials
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categories
          .filter(category => tutorials.filter(t => t.category === category).length > 1)
          .map(category => {
            const categoryVideos = tutorials.filter(tutorial => tutorial.category === category);
            return (
              <Grid item xs={12} key={category}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {category}
                </Typography>
                <Grid container spacing={3}>
                  {categoryVideos.map(tutorial => (
                    <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="180"
                          image={tutorial.thumbnail}
                          alt={tutorial.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 'auto',
                            top: 148,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            zIndex: 1
                          }}
                        >
                          {tutorial.duration}
                        </Box>
                        <CardContent sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          p: '16px !important',
                          '&:last-child': { p: '16px !important' }
                        }}>
                          <Typography variant="h6" component="div" sx={{ mb: 1, fontSize: '1.1rem' }}>
                            {tutorial.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {tutorial.description}
                          </Typography>
                          <Box sx={{ mt: 'auto' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              startIcon={<PlayArrow />}
                              onClick={() => handleVideoClick(tutorial)}
                              size="small"
                            >
                              Watch Tutorial
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            );
          })}

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {categories
              .filter(category => tutorials.filter(t => t.category === category).length === 1)
              .map(category => {
                const tutorial = tutorials.find(t => t.category === category)!;
                return (
                  <Grid item xs={12} sm={6} md={4} key={category}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      {category}
                    </Typography>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease-in-out'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={tutorial.thumbnail}
                        alt={tutorial.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 'auto',
                          top: 148,
                          right: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          zIndex: 1
                        }}
                      >
                        {tutorial.duration}
                      </Box>
                      <CardContent sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        p: '16px !important',
                        '&:last-child': { p: '16px !important' }
                      }}>
                        <Typography variant="h6" component="div" sx={{ mb: 1, fontSize: '1.1rem' }}>
                          {tutorial.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                          {tutorial.description}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<PlayArrow />}
                            onClick={() => handleVideoClick(tutorial)}
                            size="small"
                          >
                            Watch Tutorial
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle>{selectedVideo.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedVideo.description}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
} 