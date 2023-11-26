import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const LocationCard = ({num, title, imgSource, content}) => {
    
    const cardStyle = {
      width: 400, // Set the desired width
      height: 225,
      borderRadius: 16,
      margin: '10px',
      overflow: 'hidden',
      position: 'relative',
    };

    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 'inherit',
    }
  
    return (
      <Card style={cardStyle}>
        <CardContent style={{ padding: 0, position: 'relative' }}>
          <img src={`https://source.unsplash.com/random/1280x720/?${imgSource},USA'`} alt={`${title}`} style={imageStyle} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color or remove this line if not needed
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white', // Adjust the text color
              textAlign: 'center',
            }}
          > 
            <Typography variant="h4" component="div">
              {num}
            </Typography>
            <Typography variant="h3" component="div">
              {title}
            </Typography>
            <Typography variant="body2" component="div">
              {content}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default LocationCard;
