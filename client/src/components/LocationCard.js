import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const LocationCard = ({title, content}) => {
    const cardStyle = {
      width: 300, // Set the desired width
      height: 300,
      borderRadius: 16,
    };
  
    return (
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
      </Card>
    );
  };

export default LocationCard;
