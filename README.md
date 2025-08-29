#### Loadout

This app is for gamers to track and review games that they have played on any platforms, users can interact with other games, see other user reviews keep track of what they've played.

## Getting Started

First, populate the database, remember to enter your details for your own IGDB details in your own .env file.

```bash
npm run populate
```

Afterwards, setup the webhook connections to the database, so IGDB can create, update and delete games in your database to sync with theirs.

```bash
npm run connect
```

Finally, run the development server:

```bash
npm run dev
```

If run locally, Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Else, use a correctly configured domain

## Additional Commands

You can view all the webhooks connected using:

```bash
npm run view
```

You can also delete any webhooks using webhook id's:

```bash
npm run delete
```

This is a Next.js app bootstrapped with create-react-app.
