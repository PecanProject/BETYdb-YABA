# users_test/test_users.py
import unittest
import requests
import time


BASE_URL = 'http://0.0.0.0:5001/'


class BasicTests(unittest.TestCase):

    def test_index_point(self):
        response = requests.get(BASE_URL)
        self.assertEqual(response.status_code, 200)
        # print(response.content)
        self.assertEqual('"Welcome to YABA API Index Route"', response.text)
        self.assertTrue(response.ok)

    def test_insert_experiments(self):
        csv_filename = 'experiments.csv'
        csv_path = 'input_files/experiments.csv'
        files = {'fileName': open(csv_path, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/experiments?username=guestuser', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_sites(self):
        csv_filename = 'sites.csv'
        csv_path = 'input_files/'+csv_filename

        shp_file = 'input_files/S8_two_row_polys.shp'
        dbf_file = 'input_files/S8_two_row_polys.dbf'
        prj_file = 'input_files/S8_two_row_polys.prj'
        shx_file = 'input_files/S8_two_row_polys.shx'

        files= {'fileName': open(csv_path, 'rb'),
                'shp_file': open(shp_file, 'rb'),
                'dbf_file':open(dbf_file, 'rb'),
                'prj_file': open(prj_file, 'rb'),
                'shx_file': open(shx_file, 'rb')}

        response = requests.post('http://0.0.0.0:5001/yaba/v1/sites',
                            files=files)
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Successfully inserted', response.body)

    def test_insert_treatments(self):
        csv_filename = 'treatments.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/treatments?username=guestuser', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_cultivars(self):
        csv_filename = 'cultivars.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/cultivars', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_citations(self):
        csv_filename = 'citations.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/citations?username=guestuser', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_experimentSites(self):
        csv_filename = 'experiments_sites.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/experiments_sites', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_experimentTreatments(self):
        csv_filename = 'experiments_treatments.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/experiments_treatments', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_sitesCultivars(self):
        csv_filename = 'sites_cultivars.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/sites_cultivars', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)

    def test_insert_citationsSites(self):
        csv_filename = 'citations_sites.csv'
        csv = 'input_files/'+csv_filename
        files = {'fileName': open(csv, 'rb')}
        response = requests.post(
            'http://0.0.0.0:5001/yaba/v1/citations_sites', files=files)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.ok)


if __name__ == "__main__":
    time.sleep(3)
    unittest.main()
