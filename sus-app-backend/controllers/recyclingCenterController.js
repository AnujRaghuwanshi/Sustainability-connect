const RecyclingCenter = require('../models/RecyclingCenter');

// Controller to get all recycling centers
exports.getAllRecyclingCenters = async (req, res) => {
    try {
        const centers = await RecyclingCenter.find();
        res.json(centers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller to log in a recycling center with a plain-text password
exports.loginRecyclingCenter = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' });
        }

        const center = await RecyclingCenter.findOne({ email });

        if (!center) {
            return res.status(404).send({ success: false, message: 'No recycling center found' });
        }

        if (center.password !== password) {
            return res.status(401).send({ success: false, message: 'Incorrect password' });
        }

        const centerResponse = center.toObject();
        delete centerResponse.password;

        res.status(200).send({ success: true, recyclingCenter: centerResponse });
    } catch (error) {
        console.error('Error logging in recycling center:', error);
        res.status(500).send({ success: false, message: 'Error logging in recycling center' });
    }
};



// Controller to get a recycling center by centreID
exports.getRecyclingCenterByCentreID = async (req, res) => {
    try {
        const center = await RecyclingCenter.findOne({ centreID: req.params.centreID });
        if (center) {
            res.json(center);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// Controller to get a recycling center by ID
exports.getRecyclingCenterById = async (req, res) => {
    try {
        const center = await RecyclingCenter.findOne({ centreID: req.params.id });
        if (center) {
            res.json(center);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to create a new recycling center
exports.createRecyclingCenter = async (req, res) => {
    const newCenter = new RecyclingCenter(req.body);
    try {
        const savedCenter = await newCenter.save();
        res.status(201).json(savedCenter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to update a recycling center
exports.updateRecyclingCenter = async (req, res) => {
    try {
        const updatedCenter = await RecyclingCenter.findOneAndUpdate(
            { centreID: req.params.id },
            req.body,
            { new: true }
        );
        if (updatedCenter) {
            res.json(updatedCenter);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to delete a recycling center
exports.deleteRecyclingCenter = async (req, res) => {
    try {
        const deletedCenter = await RecyclingCenter.findOneAndDelete({ centreID: req.params.id });
        if (deletedCenter) {
            res.json({ message: 'Center deleted' });
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
