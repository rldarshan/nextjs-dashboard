import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <>
      <style>
        {` 
                footer {
                    padding-top: 0px !important;
                    padding-bottom: 0px !important;
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                }

                footer .MuiGrid-item:last-child {
                    padding-top: 0px  !important;
                }
            `}
      </style>

      <Box
        sx={{
          bgcolor: "#cbcbcb",
          pt: 8,
          pb: 6,
        }}
        component="footer"
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
              <Typography variant="h6" gutterBottom>
                My App
              </Typography>
              {/* <Typography variant="subtitle1" gutterBottom>
                Your company description
                </Typography>
                <Link href="#" color="inherit">
                Your website
                </Link> */}
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>

              <Link href="#" color="inherit">
                Home
              </Link>

              <Link href="#" color="inherit">
                About Us
              </Link>

              <Link href="#" color="inherit">
                Contact Us
              </Link>
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography variant="h6" gutterBottom>
                Social Media
              </Typography>

              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>

              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>

              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" align="center">
                {"Copyright © "}
                {new Date().getFullYear()}
                {" My App. All rights reserved."}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
