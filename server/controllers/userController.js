import User from '../models/User.js';
import Song from '../models/Song.js';

// Get the list of all users (admin access only)
export const getAllUsers = (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    User.findAll()
        .then(users => {
            res.status(200).json({ users });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving users', error: err });
        });
};

// Delete a user (admin access only)
export const deleteUser = (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { userId } = req.params;

    User.findByPk(userId)
        .then(user => {
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Delete all songs uploaded by this user
            Song.destroy({ where: { uploadedBy: userId } })
                .then(() => {
                    user.destroy()
                        .then(() => {
                            res.status(200).json({ message: 'User deleted successfully' });
                        })
                        .catch(err => {
                            res.status(500).json({ message: 'Error deleting user', error: err });
                        });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error deleting user songs', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error finding user', error: err });
        });
};
