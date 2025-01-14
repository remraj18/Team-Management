export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { name, email, task } = req.body;
  
      // Validate input data
      if (!name || !email || !task) {
        return res.status(400).json({ message: 'All fields are required!' });
      }
  
      try {
        // Here you can save data to a database or file
        console.log('Data Received:', { name, email, task });
  
        // Responding with success message
        return res.status(200).json({ message: 'Data saved successfully!' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error saving data.' });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed.' });
    }
  }
  