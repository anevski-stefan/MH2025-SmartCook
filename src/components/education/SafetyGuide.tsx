'use client';

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  LocalHospital,
  Kitchen,
  Whatshot,
  Restaurant,
  CleaningServices,
} from '@mui/icons-material';

interface SafetyTip {
  id: string;
  category: string;
  title: string;
  description: string;
  tips: string[];
  warning?: string;
  icon: React.ReactNode;
}

const safetyTips: SafetyTip[] = [
  {
    id: '1',
    category: 'Food Safety',
    title: 'Temperature Control',
    description: 'Proper temperature control is crucial for food safety.',
    icon: <Whatshot color="error" />,
    tips: [
      'Keep cold foods below 40°F (4°C)',
      'Keep hot foods above 140°F (60°C)',
      'The "danger zone" is between 40°F and 140°F',
      'Use a food thermometer to check temperatures',
      'Refrigerate perishables within 2 hours'
    ],
    warning: 'Never leave perishable food out at room temperature for more than 2 hours.'
  },
  {
    id: '2',
    category: 'Kitchen Safety',
    title: 'Knife Safety',
    description: 'Proper knife handling prevents injuries.',
    icon: <Restaurant color="warning" />,
    tips: [
      'Keep knives sharp - dull knives are more dangerous',
      'Always cut away from yourself',
      'Use a stable cutting board',
      'Keep fingers tucked while chopping',
      'Never try to catch a falling knife'
    ],
    warning: 'Always handle knives with dry hands and full attention.'
  },
  {
    id: '3',
    category: 'Food Safety',
    title: 'Cross-Contamination Prevention',
    description: 'Prevent foodborne illness by avoiding cross-contamination.',
    icon: <CleaningServices color="primary" />,
    tips: [
      'Use separate cutting boards for raw meat and produce',
      'Wash hands frequently while cooking',
      'Clean and sanitize surfaces after food prep',
      'Store raw meat on bottom shelf of refrigerator',
      'Use different utensils for raw and cooked foods'
    ]
  },
  {
    id: '4',
    category: 'Kitchen Safety',
    title: 'Fire Safety',
    description: 'Prevent and handle kitchen fires safely.',
    icon: <Warning color="error" />,
    tips: [
      'Never leave cooking unattended',
      'Keep a fire extinguisher in the kitchen',
      'Never use water on a grease fire',
      'Keep flammable items away from heat sources',
      'Know how to use your fire extinguisher'
    ],
    warning: 'In case of a grease fire, turn off heat and smother the fire with a lid or use a fire extinguisher.'
  },
  {
    id: '5',
    category: 'Food Safety',
    title: 'Food Storage',
    description: 'Proper food storage ensures safety and quality.',
    icon: <Kitchen color="primary" />,
    tips: [
      'Check expiration dates regularly',
      'Store raw meat on bottom shelf',
      'Keep refrigerator at 40°F or below',
      'Use airtight containers for storage',
      'Follow FIFO (First In, First Out) principle'
    ]
  },
  {
    id: '6',
    category: 'First Aid',
    title: 'Kitchen First Aid',
    description: 'Basic first aid for common kitchen injuries.',
    icon: <LocalHospital color="error" />,
    tips: [
      'Keep a first aid kit in the kitchen',
      'Know how to treat minor burns',
      'Have emergency numbers readily available',
      'Know basic wound care',
      'Learn the Heimlich maneuver'
    ],
    warning: 'Seek immediate medical attention for severe burns, cuts, or injuries.'
  }
];

export default function SafetyGuide() {
  const categories = Array.from(new Set(safetyTips.map(tip => tip.category)));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Kitchen Safety Guide
      </Typography>

      <Alert severity="warning" sx={{ mb: 4 }}>
        Always prioritize safety in the kitchen. When in doubt, err on the side of caution.
      </Alert>

      {categories.map(category => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {safetyTips
              .filter(tip => tip.category === category)
              .map(tip => (
                <Grid item xs={12} md={6} key={tip.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {tip.icon}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {tip.title}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {tip.description}
                      </Typography>

                      <List dense>
                        {tip.tips.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircle color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>

                      {tip.warning && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          {tip.warning}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Emergency Contacts
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <LocalHospital color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Emergency Services"
              secondary="911 (US) / 112 (EU)"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Warning color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Poison Control Center"
              secondary="1-800-222-1222 (US)"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
} 