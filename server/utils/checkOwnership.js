export const checkOwnership = (resourceUserId, currentUserId) => {
	if (!resourceUserId || !currentUserId) return false;
	return resourceUserId.toString() === currentUserId.toString();
};
