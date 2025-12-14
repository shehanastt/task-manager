import Task from "../models/task.js";
import HttpError from "../middlewares/httpError.js";

//add
export const addTask = async (req,res,next) => {
    try{
            const {name, description} = req.body;
            const addedTask = await new Task({
                name,
                description,
                user: req.userData.user_id,
            }).save()

            if(!addedTask){
                return next(new HttpError('no tasks added',400))
            } else{
                res.status(201).json({
                    status: true,
                    message: "Task Added",
                    data: ""
                });
            }

    } catch (err) {
        console.error("Task creation error:", err); 
        return next(new HttpError('failed adding Task',500));
    }
};

//list
export const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { user_id } = req.userData;

    const filter = {
      user: user_id,
      is_deleted: false,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Tasks fetched",
      data: tasks,
    });
  } catch (err) {
    console.error("Fetching tasks error:", err);
    return next(new HttpError("Failed fetching tasks", 500));
  }
};


//edit
export const updateTask = async (req,res,next) => {
    try{
        const {taskId} = req.params;
        const {user_id} = req.userData;
        const {name, description, status} = req.body;
       
            const updatedTask = await Task.findOneAndUpdate(
                {_id: taskId, user: user_id, is_deleted: false  },
                { name, description, status },
                { new: true }
            );
            if(!updatedTask){
                return next(new HttpError('task not found',404))
            } else {
                res.status(200).json({
                    status: true,
                    message: "Task updated",
                    data: updatedTask
                });
            }

    } catch (err) {
        console.error("Updating task status error:", err); 
        return next(new HttpError('failed updating Task status',500));
    }
};

//delete
export const deleteTask = async (req,res,next) => {
    try{
        const {taskId} = req.params;
        const {user_id} = req.userData;
            const deletedTask = await Task.findOneAndDelete({_id: taskId, user: user_id, is_deleted: false});
            if(!deletedTask){
                return next(new HttpError('task not found',404))
            } else {
                res.status(200).json({
                    status: true,
                    message: "Task deleted",
                    data: ""
                });
            }

    } catch (err) {
        console.error("Deleting task error:", err); 
        return next(new HttpError('failed deleting Task',500));
    }
};

//view
export const viewTask = async (req,res,next) => {
    try{

        const task = await Task.findOne({
            _id: req.params.taskId,
            user: req.userData.user_id,
            is_deleted: false
        });
        if(!task){
            return next(new HttpError('task not found',404))
        } else {
            res.status(200).json({
                status: true,
                message: "Task fetched",
                data: task
            });
        }
    } catch (err) {
        console.error("Viewing task error:", err); 
        return next(new HttpError('failed fetching Task',500));
    }
};

