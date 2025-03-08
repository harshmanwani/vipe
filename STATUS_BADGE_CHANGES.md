# Color-Coded Status Badges

This document outlines the changes made to implement color-coded status badges for post statuses.

## Components Created

1. **StatusBadge Component**
   - Created a new component `components/ui/status-badge.jsx`
   - Displays different colors based on the post status:
     - Available: Green
     - Pending: Blue
     - Sold: Red
     - Default: Gray

2. **StatusSelectItem Component**
   - Created a new component `components/ui/status-select-item.jsx`
   - Adds colored dots to status options in dropdown menus
   - Uses the same color scheme as the StatusBadge

## Files Updated

1. **app/page.js**
   - Replaced the standard Badge with StatusBadge for post status display
   - Updated the status filter dropdown to use StatusSelectItem

2. **app/post/[id]/page.js**
   - Replaced the standard Badge with StatusBadge for post status display

## Color Scheme

The following color scheme is used for different statuses:

| Status    | Color  | CSS Class        |
|-----------|--------|------------------|
| Available | Green  | bg-green-500     |
| Pending   | Blue   | bg-blue-500      |
| Sold      | Red    | bg-red-500       |
| Default   | Gray   | bg-gray-500      |

## How It Works

1. The `StatusBadge` component uses the post's status to determine which color to display
2. The `StatusSelectItem` component adds a colored dot next to each status option in dropdowns
3. Both components maintain the same color scheme for consistency

## Future Improvements

1. **Admin Status Management**
   - Add functionality for admins to update post statuses
   - Implement a status change history

2. **Custom Status Support**
   - Allow for custom statuses with appropriate colors
   - Add a color picker for custom statuses 