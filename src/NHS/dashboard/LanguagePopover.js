import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';


// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/static/icons/ic_flag_de.svg',
  },
  // {
  //   value: 'fr',
  //   label: 'French',
  //   icon: '/static/icons/ic_flag_fr.svg',
  // },
  // {
  //   value: 'ar',
  //   label: 'Arabic',
  //   icon: '/static/icons/Flag_of_Saudi_Arabia.svg.png',
  // },
  // {
  //   value: 'ta',
  //   label: 'tamil',
  //   icon: '/static/icons/Flag_of_india.svg',
  // },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {

  const src = localStorage.getItem('flag') || LANGS[0].icon;
  const {t,i18n} =useTranslation();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();

 
  // i18n.changeLanguage('en');
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(()=>{

  },[])

  const handleCloseSelected = (option) => {
    // console.log(option);
    setSelectedLanguage(option);
    localStorage.setItem('flag',option.icon)
    i18n.changeLanguage(option.value);
    setOpen(false);
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          maxWidth: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src={src} alt={"sample"} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {LANGS.map((option) => (
            <MenuItem key={option.value} onClick={()=>handleCloseSelected(option)}>
              <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
