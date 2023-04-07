import { Html, Head, Main, NextScript } from 'next/document'
import ParticlesComponent from '../components/Particles'

const Document = () => (
	<Html>
		<Head>
			<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
		</Head>

		<body className="font-raleway bg-black">
			<Main />
			<NextScript />
		</body>
	</Html>
)

export default Document;