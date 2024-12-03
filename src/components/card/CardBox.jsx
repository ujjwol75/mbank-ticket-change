import React from 'react'
import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

const CardBox = ({data}) => {
        // const data = [
        //     {
        //         id: 1,
        //         name: "First Coop Name",
        //         des: "This is description page."
        //     },
        //     {
        //         id: 2,
        //         title: "This is title",
        //         des: "This is description page."
        //     },
        //     {
        //         id: 3,
        //         title: "This is title",
        //         des: "This is description page."
        //     },
        //     {
        //         id: 4,
        //         title: "This is title",
        //         des: "This is description page."
        //     }
        // ];


    return (
        <div>
            <Grid container spacing={2} style={{ marginTop: "30px" }}>
                {data.map((result, index) => (
                    <Grid item xs={12} sm={3} ms={4} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    // image="/static/images/cards/contemplative-reptile.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {result.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {result.des}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default CardBox;
