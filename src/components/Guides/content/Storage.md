# Browser Storage

The Prune Tree app stores all your trees, Sims and images in the browser. This means that hosting the app does not
require expensive server space, but it also comes with some drawbacks. This guide will explain some of those 
limitations and what you need to do to prevent your trees from being lost.

:::div{.warning-note}

Remember that manually deleting your browser data will **delete all your trees, Sims and images** from this app! Be
sure to make backups as explained in the [Downloading Your Tree](/guides/download-and-backup) guide! The same goes for 
**switching to a different device** or **changing your browser**!

:::

## Storage Persistence

The first time the app is launched, we ask the browser for persistent storage. Depending on which browser you use and 
your settings, this may result in a popup asking you to confirm that you want to allow the app to store data. However, 
a lot of browsers simply make this choice for you.

Depending on the result, we show you a popup to let you know if we were able to get persistent storage or not.

::mobile-mock[Storage Persistence Popup Example]{#storagePersistence}

If persistent storage is denied, this does not necessarily mean that your data will always be lost. However, your
browser simply makes no guarantees in this case and may delete your data if for example your storage is running low.

This means it's especially important to create backups of your trees by using the **Export** feature explained in the
[Downloading Your Tree](/guides/download-and-backup) guide!

## Storage Limits

The amount of data that can be stored in the browser is limited. This means that if you have a lot of trees, Sims or
images, you may run out of space. If your browser supports it, an estimate of the current storage usage is shown 
underneath the image editor.

::mobile-mock[Storage Usage Example]{#storageUsage}

If you run out of space, you will be unable to save any changes to your trees. You will need to delete some trees, Sims 
or images to free up space.
