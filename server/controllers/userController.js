import User from '../models/User.js';
import Song from '../models/Song.js';

// Get the list of all users (admin access only)
export const getAllUsers = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const users = await User.findAll({where: {deleted: false }});
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err });
    }
};

// Delete a user (admin access only)
export const deleteUser = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete all songs uploaded by this user
        await Song.update(
            { deleted: true },
            { where: { uploadedBy: userId } } 
        );

        await user.update({ deleted: true });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user or user songs', error: err });
    }
};

