'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';

interface EquipmentItem {
  name: string;
  description: string;
  priceRange: string;
  commonUses: string[];
}

const kitchenEquipment: EquipmentItem[] = [
  {
    name: "Chef's Knife",
    description: "The most important knife in your kitchen, perfect for chopping, slicing, and dicing.",
    priceRange: "$30-$200",
    commonUses: [
      "Chopping vegetables",
      "Slicing meat",
      "Mincing herbs",
      "General food preparation"
    ]
  },
  {
    name: "Cast Iron Skillet",
    description: "A versatile pan that retains heat well and can last for generations with proper care.",
    priceRange: "$20-$200",
    commonUses: [
      "Searing meat",
      "Baking cornbread",
      "Frying eggs",
      "Roasting vegetables"
    ]
  },
  {
    name: "Stand Mixer",
    description: "Essential for baking, this powerful tool makes mixing doughs and batters effortless.",
    priceRange: "$200-$500",
    commonUses: [
      "Mixing dough",
      "Whipping cream",
      "Making pasta",
      "Kneading bread"
    ]
  },
  {
    name: "Food Processor",
    description: "A versatile machine for chopping, slicing, shredding, and pureeing ingredients quickly.",
    priceRange: "$100-$400",
    commonUses: [
      "Chopping vegetables",
      "Making pesto",
      "Shredding cheese",
      "Preparing sauces"
    ]
  },
  {
    name: "Dutch Oven",
    description: "Heavy-duty pot perfect for slow cooking, braising, and making soups and stews.",
    priceRange: "$50-$350",
    commonUses: [
      "Braising meat",
      "Making soups",
      "Baking bread",
      "Slow cooking"
    ]
  },
  {
    name: "Cutting Board",
    description: "Essential for food preparation, available in wood, plastic, or bamboo materials.",
    priceRange: "$20-$100",
    commonUses: [
      "Chopping vegetables",
      "Carving meat",
      "Food preparation",
      "Serving"
    ]
  }
];

export default function KitchenEquipment() {
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
        Essential Kitchen Equipment
      </Typography>

      <Grid container spacing={3}>
        {kitchenEquipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.name}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 2 
                }}>
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontWeight: 500,
                      color: 'primary.main'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Chip 
                    label={item.priceRange} 
                    size="small"
                    sx={{
                      backgroundColor: 'success.light',
                      color: 'success.contrastText',
                      fontWeight: 500
                    }}
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {item.description}
                </Typography>

                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                >
                  Common Uses:
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {item.commonUses.map((use, index) => (
                    <Chip
                      key={index}
                      label={use}
                      size="small"
                      sx={{
                        backgroundColor: 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 