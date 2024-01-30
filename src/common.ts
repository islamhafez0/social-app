export function timeAgo(dateString: string) {
  const now: Date = new Date();
  const date: Date = new Date(dateString);

  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) {
    return days + " days ago";
  } else if (days === 1) {
    return "1 day ago";
  } else if (hours > 1) {
    return hours + " hours ago";
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (minutes > 1) {
    return minutes + " minutes ago";
  } else if (minutes === 1) {
    return "1 minute ago";
  } else if (seconds > 1) {
    return seconds + " seconds ago";
  } else {
    return "Just now";
  }
}

export function isLiked(likesList: string[], userId: string) {
  return likesList.includes(userId);
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
