'use client';

import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

type NavigationPage = 'search' | 'scan' | 'education' | 'chat';
type SettingsKey = 'profile' | 'saved-recipes' | 'shopping-list' | 'ingredients' | 'basic-ingredients' | 'my-meals' | 'sign-out';
type SettingsLabel = 'navigation.profile' | 'navigation.savedRecipes' | 'navigation.shoppingList' | 'recipe.ingredients' | 'navigation.basicIngredients' | 'navigation.myMeals' | 'common.signOut';

interface SettingsItem {
  key: SettingsKey;
  label: SettingsLabel;
}

const pages: NavigationPage[] = ['search', 'scan', 'education', 'chat'];
const settings: SettingsItem[] = [
  { key: 'profile', label: 'navigation.profile' },
  { key: 'my-meals', label: 'navigation.myMeals' },
  { key: 'saved-recipes', label: 'navigation.savedRecipes' },
  { key: 'shopping-list', label: 'navigation.shoppingList' },
  { key: 'ingredients', label: 'recipe.ingredients' },
  { key: 'basic-ingredients', label: 'navigation.basicIngredients' },
  { key: 'sign-out', label: 'common.signOut' }
];

const getTranslationKey = (page: NavigationPage): 'common.search' | 'navigation.scan' | 'navigation.education' | 'navigation.chat' => {
  switch (page) {
    case 'search':
      return 'common.search';
    case 'scan':
      return 'navigation.scan';
    case 'education':
      return 'navigation.education';
    case 'chat':
      return 'navigation.chat';
  }
};

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path: string) => {
    if (path === '/sign-out') {
      signOut();
    } else if (path === '/profile') {
      router.push('/profile');
    } else if (path === '/saved-recipes') {
      router.push('/saved-recipes');
    } else if (path === '/shopping-list') {
      router.push('/shopping-list');
    } else if (path === '/ingredients') {
      router.push('/ingredients');
    } else if (path === '/my-meals') {
      router.push('/meals');
    } else {
      router.push(path);
    }
    handleCloseUserMenu();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <RestaurantIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Smart Cook
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ p: 1, color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '300px',
                  mt: 1
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page} 
                  onClick={() => handleNavigation(`/${page}`)}
                  sx={{ py: 1.5 }}
                >
                  <Typography textAlign="center">
                    {t(getTranslationKey(page))}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
            <RestaurantIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Smart Cook
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(`/${page}`)}
                sx={{
                  my: 2,
                  px: 2,
                  color: 'white',
                  display: 'block',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                {t(getTranslationKey(page))}
              </Button>
            ))}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            ml: { xs: 1, sm: 2 }
          }}>
            <LanguageSelector />
            <ThemeToggle />
            
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <Avatar 
                      src={user?.user_metadata?.avatar_url}
                      sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': {
                      width: '200px'
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem 
                      key={setting.key} 
                      onClick={() => {
                        if (setting.key === 'sign-out') {
                          handleSignOut();
                        } else {
                          handleNavigation(`/${setting.key}`);
                          handleCloseUserMenu();
                        }
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <Typography textAlign="center">{t(setting.label)}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/auth/login')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'primary.dark',
                  },
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                  py: { xs: 0.25, sm: 0.5, md: 0.75 },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  minWidth: { xs: '72px', sm: 'auto' },
                  height: { xs: '32px', sm: '36px', md: '40px' },
                  lineHeight: 1,
                  borderWidth: { xs: 1, sm: 2 }
                }}
              >
                {t('common.signIn')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 