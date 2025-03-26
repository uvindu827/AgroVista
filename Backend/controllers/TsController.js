import tools from "../models/TsModel.js"

export const addTools = async(req, res) => {
    try{
        const {tname, tprice, tdiscription} = req.body;
        
        if(!tname || !tprice || !tdiscription)
            return res.status(404).json({message:"Missing required fields"});

        const newTool = new tools({
            tname,
            tprice,
            tdiscription
        })

        await newTool.save();

        res.status(200).json({
            data:{
                ToolName: newTool.tname,
                ToolPrice: newTool.tprice,
                ToolDescription: newTool.tdiscription,
            }
        })

    }catch(error){
        console.error("Tool creation error", error);
        res.status(500).json({error:"Server Error"});
    }
}

