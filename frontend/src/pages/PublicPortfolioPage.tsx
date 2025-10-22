import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: white;
`;

const Header = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ShareButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PortfolioHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ArtistName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ArtistBio = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PortfolioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ImageCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImagePlaceholder = styled.div`
  height: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
`;

const ImageInfo = styled.div`
  padding: 1.5rem;
`;

const ImageTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ImageDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ContactSection = styled.div`
  text-align: center;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  padding: 3rem;
  margin-top: 4rem;
`;

const ContactTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ContactText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ContactButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

export const PublicPortfolioPage: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [portfolio, setPortfolio] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // TODO: Fetch portfolio data from API
    // Simulate loading for now
    setTimeout(() => {
      if (portfolioId === 'demo') {
        setPortfolio({
          id: 'demo',
          title: 'John Doe Portfolio',
          artist: {
            name: 'John Doe',
            bio: 'Digital artist and designer with a passion for creating beautiful, meaningful experiences through visual storytelling.'
          },
          projects: [
            {
              id: '1',
              title: 'Abstract Landscapes',
              description: 'A series exploring the intersection of nature and digital art.'
            },
            {
              id: '2',
              title: 'Urban Portraits',
              description: 'Character studies inspired by city life and human connections.'
            },
            {
              id: '3',
              title: 'Minimalist Compositions',
              description: 'Clean, geometric designs focusing on balance and negative space.'
            }
          ]
        });
      } else {
        setError('Portfolio not found');
      }
      setIsLoading(false);
    }, 1000);
  }, [portfolioId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: portfolio?.title || 'Portfolio',
        text: `Check out ${portfolio?.artist?.name}'s portfolio`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading portfolio...</LoadingState>
      </Container>
    );
  }

  if (error || !portfolio) {
    return (
      <Container>
        <ErrorState>
          <ErrorTitle>Portfolio Not Found</ErrorTitle>
          <ErrorText>
            The portfolio you're looking for doesn't exist or has been removed.
          </ErrorText>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>Portfolio Platform</Logo>
          <ShareButton onClick={handleShare}>Share</ShareButton>
        </HeaderContent>
      </Header>
      
      <Content>
        <PortfolioHeader>
          <ArtistName>{portfolio.artist.name}</ArtistName>
          <ArtistBio>{portfolio.artist.bio}</ArtistBio>
        </PortfolioHeader>
        
        <PortfolioContent>
          <Section>
            <SectionTitle>Featured Work</SectionTitle>
            <ImageGrid>
              {portfolio.projects.map((project: any) => (
                <ImageCard key={project.id}>
                  <ImagePlaceholder>
                    {project.title}
                  </ImagePlaceholder>
                  <ImageInfo>
                    <ImageTitle>{project.title}</ImageTitle>
                    <ImageDescription>{project.description}</ImageDescription>
                  </ImageInfo>
                </ImageCard>
              ))}
            </ImageGrid>
          </Section>
        </PortfolioContent>
        
        <ContactSection>
          <ContactTitle>Let's Work Together</ContactTitle>
          <ContactText>
            Interested in collaborating or have a project in mind? 
            I'd love to hear from you.
          </ContactText>
          <ContactButton>Get In Touch</ContactButton>
        </ContactSection>
      </Content>
    </Container>
  );
};