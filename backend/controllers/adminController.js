import User from '../models/User.js';

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const totalOperators = users.filter((u) => u.role === 'operator').length;

    res.status(200).json({
      success: true,
      count: totalUsers,
      metrics: {
        totalUsers,
        totalAdmins,
        totalOperators
      },
      users
    });
  } catch (error) {
    console.error('[Admin getUsers Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users list.',
      error: error.message
    });
  }
};

// @desc    Update a user's role (admin <-> operator)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'operator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Role must be either 'admin' or 'operator'."
      });
    }

    // Prevent admin from demoting their own account
    if (req.user._id.toString() === id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot demote their own account role.'
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID '${id}' not found.`
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role successfully updated to '${role}'.`,
      user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `User with ID '${req.params.id}' not found.`
      });
    }
    console.error('[Admin updateUserRole Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role.',
      error: error.message
    });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Self-deletion check: admin cannot delete their own account
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot delete their own account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID '${id}' not found.`
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully.',
      data: { id }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: `User with ID '${req.params.id}' not found.`
      });
    }
    console.error('[Admin deleteUser Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account.',
      error: error.message
    });
  }
};
