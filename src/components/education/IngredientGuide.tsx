'use client';

import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Search, ExpandMore } from '@mui/icons-material';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  uses: string[];
  storage: string;
  seasonality: string;
  substitutes: string[];
  nutritionalInfo: string;
}

const ingredients: Ingredient[] = [
  {
    id: '1',
    name: 'Garlic',
    category: 'Aromatics',
    description: 'A pungent bulb used extensively in cooking for its strong flavor and aroma.',
    uses: [
      'Base for sauces and soups',
      'Flavoring for meats and vegetables',
      'Roasted whole for a milder, sweeter taste',
      'Raw in dressings and marinades'
    ],
    storage: 'Store in a cool, dry place with good air circulation. Do not refrigerate.',
    seasonality: 'Available year-round',
    substitutes: ['Garlic powder', 'Shallots', 'Onion', 'Asafoetida'],
    nutritionalInfo: 'Low in calories, high in vitamin C and B6, contains antioxidants'
  },
  {
    id: '6',
    name: 'Ginger',
    category: 'Aromatics',
    description: 'A spicy, aromatic root used in many cuisines for its distinctive flavor and warming properties.',
    uses: [
      'Stir-fries and Asian dishes',
      'Tea and beverages',
      'Marinades and sauces',
      'Baked goods and desserts'
    ],
    storage: 'Store unpeeled in the refrigerator or freezer. Can be kept in a cool, dark place for short periods.',
    seasonality: 'Available year-round',
    substitutes: ['Ground ginger', 'Galangal', 'Turmeric', 'Cardamom'],
    nutritionalInfo: 'Contains gingerols, anti-inflammatory compounds, aids digestion'
  },
  {
    id: '2',
    name: 'Extra Virgin Olive Oil',
    category: 'Oils & Fats',
    description: 'High-quality oil pressed from olives, known for its rich flavor and health benefits.',
    uses: [
      'Salad dressings',
      'Sautéing vegetables',
      'Finishing oil for dishes',
      'Dipping oil for bread'
    ],
    storage: 'Store in a cool, dark place. Keep away from heat and light.',
    seasonality: 'Available year-round',
    substitutes: ['Avocado oil', 'Grapeseed oil', 'Butter', 'Coconut oil'],
    nutritionalInfo: 'High in healthy monounsaturated fats and antioxidants'
  },
  {
    id: '3',
    name: 'Fresh Basil',
    category: 'Herbs',
    description: 'Aromatic herb with sweet, peppery flavor essential in Italian and Thai cuisine.',
    uses: [
      'Pesto sauce',
      'Caprese salad',
      'Pizza topping',
      'Thai curries and stir-fries'
    ],
    storage: 'Store stems in water at room temperature, covered loosely with plastic.',
    seasonality: 'Best in summer months',
    substitutes: ['Dried basil', 'Oregano', 'Spinach (in pesto)', 'Thai basil'],
    nutritionalInfo: 'Contains vitamin K, antioxidants, and anti-inflammatory compounds'
  },
  {
    id: '4',
    name: 'Kosher Salt',
    category: 'Seasonings',
    description: 'Coarse-grained salt preferred by chefs for its clean taste and easy handling.',
    uses: [
      'General seasoning',
      'Brining meats',
      'Finishing dishes',
      'Controlling fermentation in baking'
    ],
    storage: 'Store in an airtight container in a dry place.',
    seasonality: 'Available year-round',
    substitutes: ['Sea salt', 'Table salt (use less)', 'Pink Himalayan salt'],
    nutritionalInfo: 'Essential mineral for body function, use in moderation'
  },
  {
    id: '5',
    name: 'Eggs',
    category: 'Dairy & Proteins',
    description: 'Versatile ingredient used in both sweet and savory cooking and baking.',
    uses: [
      'Baking and pastries',
      'Breakfast dishes',
      'Binding ingredient',
      'Enriching sauces and doughs'
    ],
    storage: 'Refrigerate at 40°F or below',
    seasonality: 'Available year-round',
    substitutes: ['Flax eggs', 'Applesauce', 'Mashed banana', 'Commercial egg replacer'],
    nutritionalInfo: 'High in protein, vitamin D, and B vitamins'
  },
  {
    id: '7',
    name: 'Butter',
    category: 'Oils & Fats',
    description: 'A dairy product made from cream, essential in baking and cooking for its rich flavor and texture.',
    uses: [
      'Baking pastries and cakes',
      'Sautéing and pan-frying',
      'Making sauces',
      'Enriching dishes'
    ],
    storage: 'Refrigerate for up to a month, or freeze for longer storage.',
    seasonality: 'Available year-round',
    substitutes: ['Margarine', 'Coconut oil', 'Olive oil', 'Applesauce (in baking)'],
    nutritionalInfo: 'High in fat and vitamins A, D, E, and K2'
  },
  {
    id: '8',
    name: 'Thyme',
    category: 'Herbs',
    description: 'A versatile herb with a subtle, dry aroma and a minty, lemony flavor.',
    uses: [
      'Roasted meats and vegetables',
      'Soups and stews',
      'Herb blends',
      'Mediterranean dishes'
    ],
    storage: 'Fresh: wrap in damp paper towel and refrigerate. Dried: store in airtight container.',
    seasonality: 'Fresh best in spring/summer, dried year-round',
    substitutes: ['Oregano', 'Marjoram', 'Rosemary', 'Sage'],
    nutritionalInfo: 'Rich in antioxidants, vitamin C, and minerals'
  },
  {
    id: '9',
    name: 'Black Pepper',
    category: 'Seasonings',
    description: 'The world\'s most traded spice, known for its sharp, spicy flavor and aroma.',
    uses: [
      'Universal seasoning',
      'Spice rubs and marinades',
      'Finishing spice',
      'Sauce seasoning'
    ],
    storage: 'Store whole peppercorns in an airtight container in a cool, dark place.',
    seasonality: 'Available year-round',
    substitutes: ['White pepper', 'Pink peppercorns', 'Grains of Paradise', 'Cayenne (for heat)'],
    nutritionalInfo: 'Contains piperine, aids digestion, has anti-inflammatory properties'
  },
  {
    id: '10',
    name: 'Greek Yogurt',
    category: 'Dairy & Proteins',
    description: 'Thick, creamy yogurt strained to remove excess whey, resulting in higher protein content.',
    uses: [
      'Breakfast and snacks',
      'Baking and cooking',
      'Base for dips and sauces',
      'Substitute for sour cream'
    ],
    storage: 'Refrigerate and consume within 1-2 weeks of opening.',
    seasonality: 'Available year-round',
    substitutes: ['Regular yogurt', 'Sour cream', 'Coconut yogurt', 'Cottage cheese'],
    nutritionalInfo: 'High in protein and calcium, contains probiotics'
  }
];

export default function IngredientGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  const handleCategoryChange = (category: string) => {
    setExpandedCategory(expandedCategory === category ? false : category);
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(ingredients.map(ingredient => ingredient.category)));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ingredient Guide
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search ingredients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {categories.map(category => (
        <Accordion
          key={category}
          expanded={expandedCategory === category}
          onChange={() => handleCategoryChange(category)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {filteredIngredients
                .filter(ingredient => ingredient.category === category)
                .map(ingredient => (
                  <Grid item xs={12} md={6} key={ingredient.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {ingredient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {ingredient.description}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Common Uses:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {ingredient.uses.map((use, index) => (
                            <Chip
                              key={index}
                              label={use}
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>
                          Storage:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {ingredient.storage}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Substitutes:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {ingredient.substitutes.map((substitute, index) => (
                            <Chip
                              key={index}
                              label={substitute}
                              variant="outlined"
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>
                          Nutritional Information:
                        </Typography>
                        <Typography variant="body2">
                          {ingredient.nutritionalInfo}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
} 