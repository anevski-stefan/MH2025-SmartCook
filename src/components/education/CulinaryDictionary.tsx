'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface CulinaryTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms: string[];
  technique?: string;
  origin?: string;
}

const culinaryTerms: CulinaryTerm[] = [
  {
    term: 'Al Dente',
    definition: 'Italian term meaning "to the tooth," describing pasta cooked until it offers a slight resistance when bitten into, rather than being overly soft.',
    category: 'Cooking Techniques',
    relatedTerms: ['Pasta', 'Italian Cuisine'],
    origin: 'Italian'
  },
  {
    term: 'Blanch',
    definition: 'To briefly cook ingredients in boiling water and then immediately plunge them into ice water to stop the cooking process. This helps preserve color, texture, and nutrients.',
    category: 'Cooking Techniques',
    relatedTerms: ['Shock', 'Parboil'],
    technique: 'Bring water to boil, cook briefly, then transfer to ice bath'
  },
  {
    term: 'Mise en Place',
    definition: 'French culinary phrase meaning "everything in its place." Refers to having all ingredients measured, cut, peeled, sliced, and ready before cooking.',
    category: 'Kitchen Organization',
    relatedTerms: ['Prep Work', 'Kitchen Organization'],
    origin: 'French'
  },
  {
    term: 'Roux',
    definition: 'A cooked mixture of equal parts flour and fat (usually butter) used to thicken sauces, soups, and stews.',
    category: 'Cooking Basics',
    relatedTerms: ['Béchamel', 'Thickening Agent'],
    technique: 'Cook flour and fat over medium heat until desired color is achieved'
  },
  {
    term: 'Sauté',
    definition: 'To cook food quickly in a small amount of hot fat in a pan over high heat while stirring or tossing.',
    category: 'Cooking Techniques',
    relatedTerms: ['Pan-fry', 'Stir-fry'],
    origin: 'French',
    technique: 'Heat pan, add oil, cook food quickly while stirring'
  },
  {
    term: 'Braise',
    definition: 'A cooking method that combines dry and moist heat: searing meat at high temperature, then cooking slowly in liquid in a covered pot.',
    category: 'Cooking Techniques',
    relatedTerms: ['Slow Cook', 'Stew'],
    technique: 'Sear meat, add liquid, cook covered on low heat'
  },
  {
    term: 'Deglaze',
    definition: 'To add liquid (wine, stock, etc.) to a pan to loosen and dissolve food particles left after cooking meat or vegetables for use in a sauce.',
    category: 'Sauce Making',
    relatedTerms: ['Pan Sauce', 'Fond'],
    technique: 'Add liquid to hot pan and scrape bottom to release flavors'
  },
  {
    term: 'Emulsion',
    definition: 'A mixture of two liquids that normally don\'t combine, such as oil and water, held together by an emulsifier (e.g., mayonnaise).',
    category: 'Cooking Science',
    relatedTerms: ['Vinaigrette', 'Mayonnaise', 'Hollandaise'],
    technique: 'Slowly combine ingredients while whisking continuously'
  },
  {
    term: 'Fold',
    definition: 'To gently combine a light, airy mixture with a heavier mixture, maintaining as much air as possible in the lighter mixture.',
    category: 'Baking Techniques',
    relatedTerms: ['Whip', 'Incorporate'],
    technique: 'Use rubber spatula to cut through mixture and gently turn over'
  },
  {
    term: 'Reduce',
    definition: 'To boil a liquid until some of it evaporates, concentrating its flavor and thickening it.',
    category: 'Sauce Making',
    relatedTerms: ['Reduction', 'Concentrate'],
    technique: 'Simmer liquid uncovered until desired consistency is reached'
  }
];

export default function CulinaryDictionary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return culinaryTerms.filter(term =>
      term.term.toLowerCase().includes(search) ||
      term.definition.toLowerCase().includes(search) ||
      term.category.toLowerCase().includes(search) ||
      term.relatedTerms.some(related => related.toLowerCase().includes(search))
    );
  }, [searchTerm]);

  const categories = useMemo(() => 
    Array.from(new Set(culinaryTerms.map(term => term.category)))
  , []);

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontWeight: 500,
          color: 'primary.main'
        }}
      >
        Culinary Dictionary
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search culinary terms..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              '& > fieldset': {
                borderColor: 'primary.main',
              }
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      {searchTerm ? (
        <List sx={{ p: 0 }}>
          {filteredTerms.map((term) => (
            <ListItem key={term.term} sx={{ p: 0, mb: 2 }}>
              <Card 
                sx={{ 
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: (theme) => theme.shadows[2]
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{ 
                        fontWeight: 500,
                        color: 'primary.main'
                      }}
                    >
                      {term.term}
                    </Typography>
                    {term.origin && (
                      <Chip
                        label={term.origin}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      color: 'text.primary',
                      lineHeight: 1.7
                    }}
                  >
                    {term.definition}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: 'text.secondary'
                    }}
                  >
                    Category: {term.category}
                  </Typography>
                  {term.technique && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        color: 'text.secondary'
                      }}
                    >
                      <strong>Technique:</strong> {term.technique}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2 }}>
                    {term.relatedTerms.map((related, i) => (
                      <Chip
                        key={i}
                        label={related}
                        size="small"
                        onClick={() => setSearchTerm(related)}
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: 'action.hover',
                          '&:hover': {
                            backgroundColor: 'action.selected'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box>
          {categories.map(category => (
            <Box key={category} sx={{ mb: 6 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 500,
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                {category}
              </Typography>
              <List sx={{ p: 0 }}>
                {culinaryTerms
                  .filter(term => term.category === category)
                  .map((term) => (
                    <Paper 
                      key={term.term} 
                      elevation={1} 
                      sx={{ 
                        mb: 2, 
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.shadows[3]
                        }
                      }}
                    >
                      <ListItem sx={{ p: 3 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 2 
                          }}>
                            <Typography 
                              variant="h6" 
                              component="div"
                              sx={{ 
                                fontWeight: 500,
                                color: 'primary.main'
                              }}
                            >
                              {term.term}
                            </Typography>
                            {term.origin && (
                              <Chip
                                label={term.origin}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: 'primary.main',
                                  color: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                          
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              mb: 2,
                              color: 'text.primary',
                              lineHeight: 1.7
                            }}
                          >
                            {term.definition}
                          </Typography>

                          {term.technique && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 2,
                                color: 'text.secondary',
                                fontStyle: 'italic'
                              }}
                            >
                              <strong>Technique:</strong> {term.technique}
                            </Typography>
                          )}

                          <Box sx={{ mt: 2 }}>
                            {term.relatedTerms.map((related, i) => (
                              <Chip
                                key={i}
                                label={related}
                                size="small"
                                onClick={() => setSearchTerm(related)}
                                sx={{ 
                                  mr: 1, 
                                  mb: 1,
                                  backgroundColor: 'action.hover',
                                  '&:hover': {
                                    backgroundColor: 'action.selected'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </ListItem>
                    </Paper>
                  ))}
              </List>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
} 