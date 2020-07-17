import React, { Component } from 'react';
import { Form, SubmitButton, List } from './styles';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container/index';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    repositoryNotFound: false,
  };
  //Carregar os dados do localstorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  //Salvar os dados do localStorage
  componentDidUpdate(prevProps, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      this.setState({ loading: true });

      const { newRepo, repositories, loading, repositoryNotFound } = this.state;

      const repoDup = repositories.filter((repository) => {
        console.log(repository);
        return  repository.name === newRepo;
      });

      if (repoDup[0]) {
        throw new Error('Repositório duplicado');
      }

      const response = await api.get(`/repos/${newRepo}`);
      console.log(repositories)

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        repositoryNotFound: false,
      });
    } catch (err) {
      console.log(err);
      if (err) {
        this.setState({
          repositoryNotFound: true,
          loading: false,
          newRepo: '',
        });
      }
    }
  };

  render() {
    const { newRepo, repositories, loading, repositoryNotFound } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form
          onSubmit={this.handleSubmit}
          repositoryNotFound={repositoryNotFound}
        >
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14}></FaPlus>
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
