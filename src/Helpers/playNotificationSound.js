import notificationSound from '../assets/sounds/notification.ogg';
let audioElement = new Audio(notificationSound);

export const playNotification = () => {
  audioElement.play();
};
