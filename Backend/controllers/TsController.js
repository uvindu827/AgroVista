import tools from "../models/TsModel.js";

//Add tools
export const addTools = async (req, res) => {
  try {
    const { tname, tquantity, tprice, tbrand, tdescription } = req.body;

    if (!tname || !tquantity || !tprice || !tbrand || !tdescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTool = new tools({
      tname,
      tquantity,
      tprice,
      tbrand,
      tdescription,
    });

    await newTool.save();

    res.status(200).json({
      message: "Tool added successfully",
      data: {
        ToolName: newTool.tname,
        Quantity: newTool.tquantity,
        ToolPrice: newTool.tprice,
        Brand: newTool.tbrand,
        ToolDescription: newTool.tdescription,
      },
    });
  } catch (error) {
    console.error("Tool creation error", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getAllTools = async (req, res) => {
  try {
    const toolsList = await tools.find();
    console.log(toolsList); // Just for debugging in the terminal

    res.status(200).json({
      message: "Tools fetched successfully",
      data: toolsList,
    });
  } catch (error) {
    console.error("Error fetching tools:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

  //update tools
  export const updateTool = async (req, res) => {
    try {
      const { id } = req.params;
      const { tname, tquantity, tprice, tbrand, tdescription } = req.body;
  
      if (!tname || !tquantity || !tprice || !tbrand || !tdescription) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const updatedTool = await tools.findByIdAndUpdate(
        id,
        { tname, tquantity, tprice, tbrand, tdescription },
        { new: true }
      );
  
      if (!updatedTool) {
        return res.status(404).json({ message: "Tool not found" });
      }
  
      res.status(200).json({
        message: "Tool updated successfully",
        data: updatedTool,
      });
    } catch (error) {
      console.error("Error updating tool:", error);
      res.status(500).json({ error: "Server Error" });
    }
  };
  //delete tools
  export const deleteTool = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedTool = await tools.findByIdAndDelete(id);
  
      if (!deletedTool) {
        return res.status(404).json({ message: "Tool not found" });
      }
  
      res.status(200).json({
        message: "Tool deleted successfully",
        data: deletedTool,
      });
    } catch (error) {
      console.error("Error deleting tool:", error);
      res.status(500).json({ error: "Server Error" });
    }
  };
  