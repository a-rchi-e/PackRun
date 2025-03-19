import express, { Request, Response, Router } from 'express';
import User from '../models/userModel';
import uploadDirectory from '../app';
import multer from 'multer';
import Runner from '../models/runnerModel';
import sequelize from '../models/model';
import { QueryTypes } from 'sequelize';

const router: Router = express.Router();

// Defining routes for the User: 

router.get('/location', (req: Request, res: Response) => {
  console.log(req.body);
  

});

// get all the runners stored in the database
router.get('/runner', async (req: Request, res: Response) => {
  try {
    const allRunners = await Runner.findAll();
    res.status(200).json(allRunners)
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error })
  }
});

// FIND RUNNERS NEARBY: 
// (GET): get all nearby runners from the database
router.get('/nearby/:id/:distance', async (req: Request, res: Response) => {
  const runnerId = req.params.id;
  const distance = req.params.distance;
  sequelize.query(
    `SELECT * FROM get_nearby_runners(:runner_id, :distance)`,
    {
      replacements: { runner_id: runnerId, distance: distance },
      type: QueryTypes.SELECT
    }
  )
    .then((results) => {
      console.log("Function results:", results);
      res.status(200).json(results);
    })
    .catch((error) => {
      console.error("Error calling function:", error);
      res.status(404);
    });
})

// CHAT: 
// (GET): get all messages from the database
// (POST): add a message to the chat
// (PUT): edit a message

// RUNNING ROUTES
// (POST): add a new run to the database
// (DELETE): remove run from the database
// (PUT): edit an already existing run

// PROFILE:
// (GET): show all data stored under user id
// (PUT): edit profile 
// (GET): show all stored routes (runs) from the user




export default router;