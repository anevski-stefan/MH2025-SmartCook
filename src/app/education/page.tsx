'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '@/hooks/useTranslation';
import CookingTutorials from '@/components/education/CookingTutorials';
import IngredientGuide from '@/components/education/IngredientGuide';
import KitchenEquipment from '@/components/education/KitchenEquipment';
import CulinaryDictionary from '@/components/education/CulinaryDictionary';
import SafetyGuide from '@/components/education/SafetyGuide';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`education-tabpanel-${index}`}
      aria-labelledby={`education-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EducationPage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('education.faq.knife.question'),
      answer: t('education.faq.knife.answer')
    },
    {
      question: t('education.faq.bakingSoda.question'),
      answer: t('education.faq.bakingSoda.answer')
    },
    {
      question: t('education.faq.contamination.question'),
      answer: t('education.faq.contamination.answer')
    },
    {
      question: t('education.faq.herbs.question'),
      answer: t('education.faq.herbs.answer')
    },
    {
      question: t('education.faq.oil.question'),
      answer: t('education.faq.oil.answer')
    },
    {
      question: t('education.faq.flour.question'),
      answer: t('education.faq.flour.answer')
    },
    {
      question: t('education.faq.cuttingBoard.question'),
      answer: t('education.faq.cuttingBoard.answer')
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            mb: { xs: 3, sm: 6 },
            fontWeight: 700,
            color: 'primary.main',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          {t('education.title')}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            mb: { xs: 3, sm: 6 },
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3
                }
              }}
            >
              <Tab label={t('education.tabs.tutorials')} />
              <Tab label={t('education.tabs.ingredients')} />
              <Tab label={t('education.tabs.equipment')} />
              <Tab label={t('education.tabs.dictionary')} />
              <Tab label={t('education.tabs.safety')} />
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <TabPanel value={tabValue} index={0}>
              <CookingTutorials />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <IngredientGuide />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <KitchenEquipment />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <CulinaryDictionary />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <SafetyGuide />
            </TabPanel>
          </Box>
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            {t('education.faq.title')}
          </Typography>
          
          {faqData.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{
                '&:before': {
                  display: 'none',
                },
                borderRadius: '8px !important',
                overflow: 'hidden',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                '&:not(:last-child)': {
                  mb: 2,
                },
                '&.Mui-expanded': {
                  margin: 0,
                  '&:not(:last-child)': {
                    mb: 2,
                  }
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)',
                  '&.Mui-expanded': {
                    minHeight: 48,
                    '& > .MuiAccordionSummary-content': {
                      margin: '12px 0'
                    }
                  }
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary'
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>
    </>
  );
} 