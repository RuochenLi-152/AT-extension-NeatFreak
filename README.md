# NeatFreak Extension for Airtable

**Tidy up your multiple-select fields with just one click.**

---

## Overview

NeatFreak helps you organize the values inside Airtable's multiple-select fields by automatically sorting them based on their predefined order. It's a simple extension designed for people who love clean, consistent data.

---

## Features

* Select any table in your base
* Select a multiple-select field from that table
* Sorts values for each record based on the select option order
* Clear and responsive UI with loading indicator and reset button

---

## Screenshots

![Screenshot 1 - Choose Table and Field](https://via.placeholder.com/1200x800?text=Choose+Table+and+Field)

![Screenshot 2 - Sorting Completed](https://via.placeholder.com/1200x800?text=Sorting+Complete)

---

## How to Use

1. Install the extension using the installation link.
2. Open the extension from the Extensions panel.
3. Choose your target table.
4. Select a multiple-select field.
5. Click **Sort** — and watch the magic.
6. Use **Reset** to clear your selections and start over.

---

## Requirements

* An Airtable base with at least one multiple-select field.
* Editor-level permissions to update records.

---

## Example Use Case

You have a field like `Weeks Attending` with values: `Week 3`, `Week 1`, `Week 4`.

NeatFreak will automatically reorder them as: `Week 1`, `Week 3`, `Week 4`, matching the configured option order.

---

## Permissions

This extension:

* **Reads** records from the selected table
* **Writes** updated sorted values back into the same records
* Does **not** access data from other tables, nor make network requests

---

## Support

Have questions or feature requests?
Contact: [rlialex3292@gmail.com](mailto:rlialex3292@gmail.com)
Docs & FAQ: [https://github.com/ruochenli/neatfreak](https://github.com/ruochenli/neatfreak)

---

## License

MIT License. Feel free to fork and improve!

---


## Reviewer Instructions

1. Open the example base (see link below).
2. Run the NeatFreak extension.
3. Select the "All Participants" table.
4. Choose the "Week#" multiple-select field.
5. Click **Sort** — confirm that options are reordered in every record.
6. Click **Reset** to clear selections and try again with different field.

---

## Reviewer Walkthrough Video

A walkthrough video is available showing the full flow:
[https://youtu.be/example-video-id](https://youtu.be/example-video-id) (placeholder)

---

## Example Base

Use this base for testing the extension:
[https://airtable.com/shr123EXAMPLE](https://airtable.com/shr123EXAMPLE) (placeholder link)

---

## External Services

This extension does not use any external services or send any data outside Airtable.

---

## Tags

`multiple-select` `data-cleaning` `sorting` `productivity`

---

## Tech Stack

* Airtable UI SDK
* React
* Airtable Blocks CLI
